const prisma = require('../config/prisma');
const {
  createSectionSchema,
  updateSectionSchema,
  createItineraryItemSchema,
  reorderSchema,
  getTemplatesQuerySchema,
  attachTemplateSchema,
} = require('../validators/tripValidator');

/**
 * Helper to recalculate and update total budget for a trip
 */
const syncTripTotalBudget = async (tripId) => {
  const result = await prisma.tripSection.aggregate({
    where: { tripId },
    _sum: {
      budgetAllocated: true,
    },
  });

  const newTotalBudget = result._sum.budgetAllocated || 0.0;

  await prisma.trip.update({
    where: { id: tripId },
    data: {
      totalBudget: newTotalBudget,
    },
  });

  return newTotalBudget;
};

/**
 * @desc    Browse & discover predefined section packages / templates
 * @route   GET /api/sections/templates
 * @access  Public / Protected
 */
const getSectionTemplates = async (req, res, next) => {
  try {
    const query = getTemplatesQuerySchema.parse(req.query);
    const { cityId, region, maxDays, maxBudget, search, sortBy, page, limit } = query;

    const where = {};

    if (cityId) {
      where.cityId = cityId;
    }

    if (region) {
      where.city = {
        region: { equals: region, mode: 'insensitive' },
      };
    }

    if (maxDays !== undefined) {
      where.durationDays = { lte: maxDays };
    }

    if (maxBudget !== undefined) {
      where.suggestedBudget = { lte: maxBudget };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    let orderBy = { popularityScore: 'desc' };
    if (sortBy === 'duration_asc') orderBy = { durationDays: 'asc' };
    if (sortBy === 'budget_asc') orderBy = { suggestedBudget: 'asc' };

    const skip = (page - 1) * limit;

    const [templates, total] = await Promise.all([
      prisma.sectionTemplate.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          city: true,
          templateItems: {
            orderBy: { orderIndex: 'asc' },
            include: { activity: true },
          },
        },
      }),
      prisma.sectionTemplate.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.status(200).json({
      success: true,
      data: {
        templates,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Attach / Clone a predefined section package directly into a user trip plan
 * @route   POST /api/trips/:id/sections/attach-template
 * @access  Private (Protected by verifyToken)
 */
const attachTemplateSection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: tripId } = req.params;
    const { templateSectionId, startDate, customTitle } = attachTemplateSchema.parse(req.body);

    // 1. Verify trip exists and belongs to user
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
      include: {
        sections: {
          orderBy: { orderIndex: 'desc' },
          take: 1,
        },
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized.',
      });
    }

    // 2. Fetch predefined section template with template items
    const template = await prisma.sectionTemplate.findUnique({
      where: { id: templateSectionId },
      include: {
        city: true,
        templateItems: {
          orderBy: [{ dayOffset: 'asc' }, { orderIndex: 'asc' }],
        },
      },
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Predefined section template package not found.',
      });
    }

    // 3. Calculate start date and end date based on durationDays
    let sectionStart = startDate ? new Date(startDate) : null;

    if (!sectionStart) {
      if (trip.sections && trip.sections.length > 0) {
        // Start next day after last section ends
        const lastEnd = new Date(trip.sections[0].endDate);
        sectionStart = new Date(lastEnd.getTime() + 1 * 24 * 60 * 60 * 1000);
      } else {
        sectionStart = new Date(trip.startDate);
      }
    }

    const durationDays = template.durationDays || 1;
    const sectionEnd = new Date(sectionStart.getTime() + (durationDays - 1) * 24 * 60 * 60 * 1000);

    // 4. Determine order index
    const lastOrder = trip.sections && trip.sections.length > 0 ? trip.sections[0].orderIndex : 0;
    const nextOrderIndex = lastOrder + 1;

    // 5. Create section & clone items inside a transaction
    const createdSection = await prisma.$transaction(async (tx) => {
      const section = await tx.tripSection.create({
        data: {
          tripId,
          cityId: template.cityId,
          sectionTitle: customTitle || template.title,
          startDate: sectionStart,
          endDate: sectionEnd,
          budgetAllocated: template.suggestedBudget,
          description: template.description || null,
          orderIndex: nextOrderIndex,
        },
      });

      if (template.templateItems && template.templateItems.length > 0) {
        const clonedItemsData = template.templateItems.map((item, idx) => ({
          sectionId: section.id,
          activityId: item.activityId || null,
          title: item.title,
          type: item.type,
          startTime: item.startTime || null,
          endTime: item.endTime || null,
          cost: item.estimatedCost,
          orderIndex: idx + 1,
          notes: item.notes || `Day ${item.dayOffset} Activity`,
        }));

        await tx.itineraryItem.createMany({
          data: clonedItemsData,
        });
      }

      return await tx.tripSection.findUnique({
        where: { id: section.id },
        include: {
          city: true,
          items: {
            orderBy: { orderIndex: 'asc' },
            include: { activity: true },
          },
        },
      });
    });

    // 6. Sync total trip budget
    const updatedTotalBudget = await syncTripTotalBudget(tripId);

    // 7. Update main trip end date if new section extends it
    if (sectionEnd > new Date(trip.endDate)) {
      await prisma.trip.update({
        where: { id: tripId },
        data: { endDate: sectionEnd },
      });
    }

    return res.status(201).json({
      success: true,
      message: `Attached section package "${template.title}" to your trip plan!`,
      data: {
        section: createdSection,
        clonedItemsCount: createdSection.items.length,
        tripTotalBudget: updatedTotalBudget,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new section / stop to a trip (Screen 5 & 9)
 * @route   POST /api/trips/:id/sections
 * @access  Private (Protected by verifyToken)
 */
const createSection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: tripId } = req.params;
    const validatedData = createSectionSchema.parse(req.body);
    const { sectionTitle, cityId, startDate, endDate, budgetAllocated, description } = validatedData;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized.',
      });
    }

    const parsedStart = new Date(startDate);
    const parsedEnd = new Date(endDate);

    if (parsedEnd < parsedStart) {
      return res.status(400).json({
        success: false,
        message: 'Section end date cannot be earlier than start date.',
      });
    }

    const lastSection = await prisma.tripSection.findFirst({
      where: { tripId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });

    const nextOrderIndex = lastSection ? lastSection.orderIndex + 1 : 1;

    const newSection = await prisma.tripSection.create({
      data: {
        tripId,
        cityId: cityId || null,
        sectionTitle,
        startDate: parsedStart,
        endDate: parsedEnd,
        budgetAllocated: budgetAllocated || 0.0,
        description: description || null,
        orderIndex: nextOrderIndex,
      },
      include: {
        city: true,
        items: true,
      },
    });

    const updatedTotalBudget = await syncTripTotalBudget(tripId);

    let updatedTripDates = {};
    if (parsedStart < new Date(trip.startDate)) updatedTripDates.startDate = parsedStart;
    if (parsedEnd > new Date(trip.endDate)) updatedTripDates.endDate = parsedEnd;

    if (Object.keys(updatedTripDates).length > 0) {
      await prisma.trip.update({
        where: { id: tripId },
        data: updatedTripDates,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Section added to trip successfully.',
      data: {
        section: newSection,
        tripTotalBudget: updatedTotalBudget,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all sections for a trip
 * @route   GET /api/trips/:id/sections
 * @access  Private (Protected by verifyToken)
 */
const getSections = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: tripId } = req.params;
    const { search, sortBy } = req.query;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized.',
      });
    }

    const where = { tripId };

    if (search) {
      where.OR = [
        { sectionTitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    let orderBy = { orderIndex: 'asc' };
    if (sortBy === 'startDate_asc') orderBy = { startDate: 'asc' };
    if (sortBy === 'budget_desc') orderBy = { budgetAllocated: 'desc' };

    const sections = await prisma.tripSection.findMany({
      where,
      orderBy,
      include: {
        city: true,
        items: {
          orderBy: { orderIndex: 'asc' },
          include: { activity: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        tripId,
        sections,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a trip section
 * @route   PUT /api/trips/:id/sections/:sectionId
 * @access  Private (Protected by verifyToken)
 */
const updateSection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: tripId, sectionId } = req.params;
    const validatedData = updateSectionSchema.parse(req.body);

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized.',
      });
    }

    const section = await prisma.tripSection.findFirst({
      where: { id: sectionId, tripId },
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Trip section not found.',
      });
    }

    const updateData = {};
    if (validatedData.sectionTitle !== undefined) updateData.sectionTitle = validatedData.sectionTitle;
    if (validatedData.cityId !== undefined) updateData.cityId = validatedData.cityId;
    if (validatedData.startDate !== undefined) updateData.startDate = new Date(validatedData.startDate);
    if (validatedData.endDate !== undefined) updateData.endDate = new Date(validatedData.endDate);
    if (validatedData.budgetAllocated !== undefined) updateData.budgetAllocated = validatedData.budgetAllocated;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;

    const updatedSection = await prisma.tripSection.update({
      where: { id: sectionId },
      data: updateData,
      include: {
        city: true,
        items: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    const updatedTotalBudget = await syncTripTotalBudget(tripId);

    return res.status(200).json({
      success: true,
      message: 'Section updated successfully.',
      data: {
        section: updatedSection,
        tripTotalBudget: updatedTotalBudget,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a trip section & cascade items
 * @route   DELETE /api/trips/:id/sections/:sectionId
 * @access  Private (Protected by verifyToken)
 */
const deleteSection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: tripId, sectionId } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized.',
      });
    }

    const section = await prisma.tripSection.findFirst({
      where: { id: sectionId, tripId },
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found.',
      });
    }

    await prisma.tripSection.delete({
      where: { id: sectionId },
    });

    const remainingSections = await prisma.tripSection.findMany({
      where: { tripId },
      orderBy: { orderIndex: 'asc' },
    });

    await prisma.$transaction(
      remainingSections.map((sec, index) =>
        prisma.tripSection.update({
          where: { id: sec.id },
          data: { orderIndex: index + 1 },
        })
      )
    );

    const updatedTotalBudget = await syncTripTotalBudget(tripId);

    return res.status(200).json({
      success: true,
      message: 'Section deleted and remaining sections re-indexed.',
      data: {
        tripTotalBudget: updatedTotalBudget,
        remainingSectionsCount: remainingSections.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add an itinerary item to a section
 * @route   POST /api/trips/:id/sections/:sectionId/items
 * @access  Private (Protected by verifyToken)
 */
const addItemToSection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: tripId, sectionId } = req.params;
    const validatedData = createItineraryItemSchema.parse(req.body);

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized.',
      });
    }

    const section = await prisma.tripSection.findFirst({
      where: { id: sectionId, tripId },
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found.',
      });
    }

    const lastItem = await prisma.itineraryItem.findFirst({
      where: { sectionId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });

    const nextOrderIndex = lastItem ? lastItem.orderIndex + 1 : 1;

    const newItem = await prisma.itineraryItem.create({
      data: {
        sectionId,
        activityId: validatedData.activityId || null,
        title: validatedData.title,
        type: validatedData.type || 'ACTIVITY',
        startTime: validatedData.startTime || null,
        endTime: validatedData.endTime || null,
        cost: validatedData.cost || 0.0,
        notes: validatedData.notes || null,
        orderIndex: nextOrderIndex,
      },
      include: {
        activity: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Itinerary item added successfully.',
      data: {
        item: newItem,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Batch reorder sections or itinerary items using $transaction
 * @route   PUT /api/trips/:id/sections/reorder
 * @access  Private (Protected by verifyToken)
 */
const reorderItinerary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: tripId } = req.params;
    const validatedData = reorderSchema.parse(req.body);
    const { sections, items } = validatedData;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized.',
      });
    }

    const transactionOperations = [];

    if (sections && sections.length > 0) {
      sections.forEach((sec) => {
        transactionOperations.push(
          prisma.tripSection.update({
            where: { id: sec.id },
            data: { orderIndex: sec.orderIndex },
          })
        );
      });
    }

    if (items && items.length > 0) {
      items.forEach((item) => {
        transactionOperations.push(
          prisma.itineraryItem.update({
            where: { id: item.id },
            data: { orderIndex: item.orderIndex },
          })
        );
      });
    }

    if (transactionOperations.length > 0) {
      await prisma.$transaction(transactionOperations);
    }

    return res.status(200).json({
      success: true,
      message: 'Reordered successfully.',
      data: {
        reorderedSectionsCount: sections ? sections.length : 0,
        reorderedItemsCount: items ? items.length : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSectionTemplates,
  attachTemplateSection,
  createSection,
  getSections,
  updateSection,
  deleteSection,
  addItemToSection,
  reorderItinerary,
};
