const prisma = require('../config/prisma');
const { myTripsQuerySchema } = require('../validators/dashboardValidator');

/**
 * Helper function to calculate duration in days between two dates
 */
const calculateDurationDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
};

/**
 * Helper to format raw Prisma trip model into standard response schema
 */
const formatTripItem = (trip) => {
  return {
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
  };
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

    // 1. Build `where` clause
    const where = {
      userId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    // 2. Build `orderBy` clause
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

    // 3. Handle Grouping Logic vs Standard Paginated List
    if (groupBy !== 'none') {
      // Fetch all matching trips for grouping
      const rawTrips = await prisma.trip.findMany({
        where,
        orderBy,
        include: {
          sections: {
            include: {
              city: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
          _count: {
            select: { sections: true },
          },
        },
      });

      const formattedTrips = rawTrips.map(formatTripItem);

      if (groupBy === 'status') {
        const groupedByStatus = {
          ongoing: formattedTrips.filter((t) => t.status === 'ONGOING'),
          upcoming: formattedTrips.filter((t) => t.status === 'UPCOMING'),
          completed: formattedTrips.filter((t) => t.status === 'COMPLETED'),
        };

        return res.status(200).json({
          success: true,
          data: {
            groupBy: 'status',
            total: formattedTrips.length,
            groups: groupedByStatus,
          },
        });
      }

      if (groupBy === 'year') {
        const groupedByYear = {};
        formattedTrips.forEach((trip) => {
          const year = new Date(trip.startDate).getFullYear().toString();
          if (!groupedByYear[year]) {
            groupedByYear[year] = [];
          }
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

    // Standard Non-Grouped Paginated Response
    const skip = (page - 1) * limit;

    const [rawTrips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          sections: {
            include: {
              city: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
          _count: {
            select: { sections: true },
          },
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
  getMyTrips,
};
