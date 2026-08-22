const prisma = require('../config/prisma');

/**
 * Helper function to calculate duration in days
 */
const calculateDurationDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
};

/**
 * @desc    Get combined Dashboard / Landing Page screen payload
 * @route   GET /api/dashboard/landing
 * @access  Private (Protected by verifyToken)
 */
const getLandingData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Fetch Top Regional Destinations (flagged isTopRegional = true)
    const topCities = await prisma.city.findMany({
      where: { isTopRegional: true },
      orderBy: { popularityScore: 'desc' },
      take: 12,
    });

    // Categorize/group top cities by region
    const regionalRecommendations = topCities.reduce((acc, city) => {
      const regionKey = city.region || 'Featured';
      if (!acc[regionKey]) {
        acc[regionKey] = [];
      }
      acc[regionKey].push(city);
      return acc;
    }, {});

    // 2. Fetch User's latest active trip (first check ONGOING, then next UPCOMING)
    let activeTrip = await prisma.trip.findFirst({
      where: {
        userId,
        status: 'ONGOING',
      },
      orderBy: { startDate: 'asc' },
      include: {
        sections: {
          include: { city: true },
          orderBy: { order: 'asc' },
        },
        _count: { select: { sections: true } },
      },
    });

    if (!activeTrip) {
      activeTrip = await prisma.trip.findFirst({
        where: {
          userId,
          status: 'UPCOMING',
        },
        orderBy: { startDate: 'asc' },
        include: {
          sections: {
            include: { city: true },
            orderBy: { order: 'asc' },
          },
          _count: { select: { sections: true } },
        },
      });
    }

    let formattedActiveTrip = null;
    if (activeTrip) {
      formattedActiveTrip = {
        id: activeTrip.id,
        name: activeTrip.name,
        description: activeTrip.description,
        coverPhotoUrl: activeTrip.coverPhotoUrl,
        startDate: activeTrip.startDate,
        endDate: activeTrip.endDate,
        status: activeTrip.status,
        totalBudget: activeTrip.totalBudget,
        isPublic: activeTrip.isPublic,
        stopsCount: activeTrip._count?.sections ?? activeTrip.sections.length,
        durationDays: calculateDurationDays(activeTrip.startDate, activeTrip.endDate),
        sections: activeTrip.sections,
      };
    }

    // 3. Fetch Dashboard Stats in parallel
    const [completedTripsCount, upcomingTripsCount, ongoingTripsCount, savedCitiesCount] =
      await Promise.all([
        prisma.trip.count({ where: { userId, status: 'COMPLETED' } }),
        prisma.trip.count({ where: { userId, status: 'UPCOMING' } }),
        prisma.trip.count({ where: { userId, status: 'ONGOING' } }),
        prisma.userSavedCity.count({ where: { userId } }),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
        },
        activeTrip: formattedActiveTrip,
        topRegionalRecommendations: regionalRecommendations,
        stats: {
          completedTripsCount,
          upcomingTripsCount,
          ongoingTripsCount,
          savedCitiesCount,
          totalTripsCount: completedTripsCount + upcomingTripsCount + ongoingTripsCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLandingData,
};
