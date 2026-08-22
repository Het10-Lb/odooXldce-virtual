const prisma = require('../config/prisma');
const {
  createTripSchema,
  getSuggestionsQuerySchema,
} = require('../validators/tripValidator');
const { myTripsQuerySchema } = require('../validators/dashboardValidator');

/**
 * Helper to calculate duration in days
 */
const calculateDurationDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
};

/**
 * Helper to determine initial trip status based on start & end dates
 */
const determineTripStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'UPCOMING';
  if (start <= now && now <= end) return 'ONGOING';
  return 'COMPLETED';
};

/**
 * @desc    Create a new trip (Screen 4 initialization)
 * @route   POST /api/trips
 * @access  Private (Protected by verifyToken)
 */
const createTrip = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const validatedData = createTripSchema.parse(req.body);
    const {
      name,
      startDate,
      endDate,
      description,
      coverPhotoUrl,
      initialCityId,
      initialBudget,
      isPublic,
    } = validatedData;

    const parsedStart = new Date(startDate);
    const parsedEnd = new Date(endDate);

    if (parsedEnd < parsedStart) {
      return res.status(400).json({
        success: false,
        message: 'Trip end date cannot be earlier than start date.',
      });
    }

    const calculatedStatus = determineTripStatus(parsedStart, parsedEnd);

    // 1. Create Trip Record
    const newTrip = await prisma.trip.create({
      data: {
        userId,
        name,
        description: description || null,
        coverPhotoUrl: coverPhotoUrl || null,
        startDate: parsedStart,
        endDate: parsedEnd,
        status: calculatedStatus,
        totalBudget: initialBudget || 0.0,
        isPublic: isPublic || false,
      },
    });

    let initialSection = null;
    let suggestedActivities = [];

    // 2. If initialCityId provided, create Section 1 & fetch top activity suggestions
    if (initialCityId) {
      const city = await prisma.city.findUnique({
        where: { id: initialCityId },
      });

      const sectionTitle = city ? `Section 1: ${city.name}` : 'Section 1: Destination';

      initialSection = await prisma.tripSection.create({
        data: {
          tripId: newTrip.id,
          cityId: initialCityId,
          sectionTitle,
          startDate: parsedStart,
          endDate: parsedEnd,
          budgetAllocated: initialBudget || 0.0,
          orderIndex: 1,
        },
        include: {
          city: true,
          items: true,
        },
      });

      suggestedActivities = await prisma.activity.findMany({
        where: { cityId: initialCityId },
        orderBy: { popularityScore: 'desc' },
        take: 10,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Trip initialized successfully.',
      data: {
        trip: {
          ...newTrip,
          stopsCount: initialSection ? 1 : 0,
          durationDays: calculateDurationDays(parsedStart, parsedEnd),
        },
        initialSection,
        suggestedActivities,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed itinerary for a specific trip
 * @route   GET /api/trips/:id
 * @access  Private (Protected by verifyToken)
 */
const getTripById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const trip = await prisma.trip.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            city: true,
            items: {
              orderBy: { orderIndex: 'asc' },
              include: {
                activity: true,
              },
            },
          },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        trip: {
          ...trip,
          stopsCount: trip.sections.length,
          durationDays: calculateDurationDays(trip.startDate, trip.endDate),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get catalog activity suggestions for planning a destination
 * @route   GET /api/trips/:id/suggestions
 * @access  Private (Protected by verifyToken)
 */
const getTripSuggestions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = getSuggestionsQuerySchema.parse(req.query);
    const { cityId, type, maxCost, search, page, limit } = query;

    let targetCityId = cityId;

    // If cityId not provided, default to destination city of first section in trip
    if (!targetCityId) {
      const firstSection = await prisma.tripSection.findFirst({
        where: { tripId: id },
        select: { cityId: true },
        orderBy: { orderIndex: 'asc' },
      });
      targetCityId = firstSection?.cityId || undefined;
    }

    const where = {};

    if (targetCityId) {
      where.cityId = targetCityId;
    }

    if (type) {
      where.type = type;
    }

    if (maxCost !== undefined) {
      where.estimatedCost = { lte: maxCost };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: { popularityScore: 'desc' },
        skip,
        take: limit,
        include: {
          city: true,
        },
      }),
      prisma.activity.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.status(200).json({
      success: true,
      data: {
        targetCityId,
        activities,
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
 * @desc    Get user's trips with search, status filter, sorting, pagination, and grouping
 * @route   GET /api/trips/my-trips
 * @access  Private (Protected by verifyToken)
 */
const getMyTrips = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const query = myTripsQuerySchema.parse(req.query);
    const { search, status, groupBy, sortBy, page, limit } = query;

    const where = { userId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    let orderBy = { startDate: 'desc' };
    if (sortBy === 'startDate_asc') {
      orderBy = { startDate: 'asc' };
    } else if (sortBy === 'startDate_desc') {
      orderBy = { startDate: 'desc' };
    } else if (sortBy === 'budget_desc') {
      orderBy = { totalBudget: 'desc' };
    } else if (sortBy === 'createdAt_desc') {
      orderBy = { createdAt: 'desc' };
    }

    const formatTripItem = (trip) => ({
      id: trip.id,
      name: trip.name,
      description: trip.description,
      coverPhotoUrl: trip.coverPhotoUrl,
      startDate: trip.startDate,
      endDate: trip.endDate,
      status: trip.status,
      totalBudget: trip.totalBudget,
      isPublic: trip.isPublic,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
      stopsCount: trip._count?.sections ?? (trip.sections ? trip.sections.length : 0),
      durationDays: calculateDurationDays(trip.startDate, trip.endDate),
      sections: trip.sections || [],
    });

    if (groupBy !== 'none') {
      const rawTrips = await prisma.trip.findMany({
        where,
        orderBy,
        include: {
          sections: {
            include: { city: true },
            orderBy: { orderIndex: 'asc' },
          },
          _count: { select: { sections: true } },
        },
      });

      const formattedTrips = rawTrips.map(formatTripItem);

      if (groupBy === 'status') {
        return res.status(200).json({
          success: true,
          data: {
            groupBy: 'status',
            total: formattedTrips.length,
            groups: {
              ongoing: formattedTrips.filter((t) => t.status === 'ONGOING'),
              upcoming: formattedTrips.filter((t) => t.status === 'UPCOMING'),
              completed: formattedTrips.filter((t) => t.status === 'COMPLETED'),
            },
          },
        });
      }

      if (groupBy === 'year') {
        const groupedByYear = {};
        formattedTrips.forEach((trip) => {
          const year = new Date(trip.startDate).getFullYear().toString();
          if (!groupedByYear[year]) groupedByYear[year] = [];
          groupedByYear[year].push(trip);
        });

        return res.status(200).json({
          success: true,
          data: {
            groupBy: 'year',
            total: formattedTrips.length,
            groups: groupedByYear,
          },
        });
      }
    }

    const skip = (page - 1) * limit;

    const [rawTrips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          sections: {
            include: { city: true },
            orderBy: { orderIndex: 'asc' },
          },
          _count: { select: { sections: true } },
        },
      }),
      prisma.trip.count({ where }),
    ]);

    const formattedTrips = rawTrips.map(formatTripItem);
    const totalPages = Math.ceil(total / limit) || 1;

    return res.status(200).json({
      success: true,
      data: {
        groupBy: 'none',
        trips: formattedTrips,
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

module.exports = {
  createTrip,
  getTripById,
  getTripSuggestions,
  getMyTrips,
};
