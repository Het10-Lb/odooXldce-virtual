const prisma = require('../config/prisma');
const { topRegionalQuerySchema } = require('../validators/dashboardValidator');

/**
 * @desc    Get top regional destinations with search, filter, sort & pagination
 * @route   GET /api/destinations/top-regional
 * @access  Public / Protected
 */
const getTopRegionalDestinations = async (req, res, next) => {
  try {
    let query = {};
    try {
      query = topRegionalQuerySchema.parse(req.query || {});
    } catch (_err) {
      query = { page: 1, limit: 5, sortBy: 'popularity_desc' };
    }
    const { search, region, maxCost, sortBy, page = 1, limit = 5 } = query;

    const where = {};

    if (!search && !region) {
      where.isTopRegional = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { region: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (region) {
      where.region = { equals: region, mode: 'insensitive' };
    }

    if (maxCost !== undefined) {
      where.costIndex = { lte: maxCost };
    }

    let orderBy = { popularityScore: 'desc' };
    if (sortBy === 'cost_asc') {
      orderBy = { costIndex: 'asc' };
    } else if (sortBy === 'cost_desc') {
      orderBy = { costIndex: 'desc' };
    } else if (sortBy === 'name_asc') {
      orderBy = { name: 'asc' };
    }

    const skip = (page - 1) * limit;

    let [destinations, total] = await Promise.all([
      prisma.city.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.city.count({ where }),
    ]);

    if (destinations.length === 0 && !search && !region) {
      destinations = await prisma.city.findMany({
        orderBy: { popularityScore: 'desc' },
        take: limit,
      });
      total = destinations.length;
    }

    const totalPages = Math.ceil(total / limit) || 1;

    return res.status(200).json({
      success: true,
      data: {
        destinations,
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
 * @desc    Get all unique regions available in database
 * @route   GET /api/destinations/regions
 * @access  Public
 */
const getRegions = async (req, res, next) => {
  try {
    const rawRegions = await prisma.city.findMany({
      select: { region: true },
      distinct: ['region'],
    });

    const regions = rawRegions.map((r) => r.region).filter(Boolean);

    return res.status(200).json({
      success: true,
      data: {
        regions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single destination details by ID
 * @route   GET /api/destinations/:id
 * @access  Public
 */
const getDestinationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        activities: {
          take: 10,
          orderBy: { popularityScore: 'desc' },
        },
      },
    });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        destination: city,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle Save / Favorite a city for authenticated user
 * @route   POST /api/destinations/:id/save
 * @access  Private (Protected by verifyToken)
 */
const toggleSaveCity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: cityId } = req.params;

    const existingSave = await prisma.userSavedCity.findUnique({
      where: {
        userId_cityId: { userId, cityId },
      },
    });

    if (existingSave) {
      await prisma.userSavedCity.delete({
        where: { id: existingSave.id },
      });
      return res.status(200).json({
        success: true,
        message: 'City removed from saved favorites.',
        data: { isSaved: false },
      });
    } else {
      await prisma.userSavedCity.create({
        data: { userId, cityId },
      });
      return res.status(200).json({
        success: true,
        message: 'City added to saved favorites.',
        data: { isSaved: true },
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTopRegionalDestinations,
  getRegions,
  getDestinationById,
  toggleSaveCity,
};
