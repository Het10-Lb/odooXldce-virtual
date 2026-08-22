const prisma = require('../config/prisma');

/**
 * @desc    Browse curated multi-day trip templates
 * @route   GET /api/templates
 * @access  Public / Optional Auth
 */
const getTemplates = async (req, res, next) => {
  try {
    const { state, search, maxBudget, durationDays, page = 1, limit = 10 } = req.query;

    const where = {};

    if (state) {
      where.state = { equals: state, mode: 'insensitive' };
    }

    if (maxBudget) {
      where.estimatedBudget = { lte: parseFloat(maxBudget) };
    }

    if (durationDays) {
      where.durationDays = { lte: parseInt(durationDays, 10) };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ];
    }

    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (p - 1) * l;

    const [templates, total] = await Promise.all([
      prisma.tripTemplate.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: l,
        include: {
          city: true,
        },
      }),
      prisma.tripTemplate.count({ where }),
    ]);

    const totalPages = Math.ceil(total / l) || 1;

    return res.status(200).json({
      success: true,
      data: {
        templates,
        pagination: {
          total,
          page: p,
          limit: l,
          totalPages,
          hasNextPage: p < totalPages,
          hasPrevPage: p > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed multi-day trip template payload
 * @route   GET /api/templates/:id
 * @access  Public / Optional Auth
 */
const getTemplateById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const template = await prisma.tripTemplate.findUnique({
      where: { id },
      include: {
        city: true,
      },
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Trip template not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        template,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clone a multi-day TripTemplate directly into the authenticated user's trip list
 * @route   POST /api/templates/:templateId/create-trip
 * @access  Private (Protected by verifyToken)
 */
const createTripFromTemplate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { templateId } = req.params;
    const { startDate, name } = req.body;

    if (!startDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date is required to create a trip from template.',
      });
    }

    const template = await prisma.tripTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Trip template not found.',
      });
    }

    const parsedStart = new Date(startDate);
    const durationDays = template.durationDays || 1;
    const parsedEnd = new Date(parsedStart.getTime() + (durationDays - 1) * 24 * 60 * 60 * 1000);

    const now = new Date();
    let status = 'UPCOMING';
    if (now >= parsedStart && now <= parsedEnd) status = 'ONGOING';
    if (now > parsedEnd) status = 'COMPLETED';

    const templateData = template.templateData || {};
    const templateSections = templateData.sections || [];

    // Clone into User's Trips using a transaction
    const clonedTrip = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.create({
        data: {
          userId,
          name: name || template.title,
          description: template.description,
          coverPhotoUrl: template.coverPhotoUrl,
          startDate: parsedStart,
          endDate: parsedEnd,
          status,
          totalBudget: template.estimatedBudget,
          isPublic: false,
        },
      });

      if (templateSections.length > 0) {
        for (let i = 0; i < templateSections.length; i++) {
          const sec = templateSections[i];
          const secDays = sec.durationDays || 1;
          const secStart = new Date(parsedStart.getTime() + i * secDays * 24 * 60 * 60 * 1000);
          const secEnd = new Date(secStart.getTime() + (secDays - 1) * 24 * 60 * 60 * 1000);

          const section = await tx.tripSection.create({
            data: {
              tripId: trip.id,
              cityId: sec.cityId || template.cityId || null,
              sectionTitle: sec.title || `Section ${i + 1}`,
              startDate: secStart,
              endDate: secEnd,
              budgetAllocated: sec.budget || 0.0,
              description: sec.description || null,
              orderIndex: i + 1,
            },
          });

          if (sec.items && sec.items.length > 0) {
            await tx.itineraryItem.createMany({
              data: sec.items.map((item, idx) => ({
                sectionId: section.id,
                title: item.title,
                type: item.type || 'ACTIVITY',
                startTime: item.startTime || null,
                endTime: item.endTime || null,
                cost: item.cost || 0.0,
                orderIndex: idx + 1,
                notes: item.notes || null,
              })),
            });
          }
        }
      }

      return await tx.trip.findUnique({
        where: { id: trip.id },
        include: {
          sections: {
            orderBy: { orderIndex: 'asc' },
            include: { city: true, items: true },
          },
        },
      });
    });

    return res.status(201).json({
      success: true,
      message: `Trip "${template.title}" created successfully from template!`,
      data: {
        trip: clonedTrip,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTemplates,
  getTemplateById,
  createTripFromTemplate,
};
