const prisma = require('../config/prisma');
const { topRegionalQuerySchema } = require('../validators/dashboardValidator');

/**
 * @desc    Get top regional destinations with search, filter, sort & pagination
 * @route   GET /api/destinations/top-regional
 * @access  Public / Protected
 */
const getTopRegionalDestinations = async (req, res, next) => {
  try {
    // 1. Validate query parameters
    const query = topRegionalQuerySchema.parse(req.query);
    const { search, region, maxCost, sortBy, page, limit } = query;

    // 2. Build dynamic Prisma `where` clause
    const where = {
      isTopRegional: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { region: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (region) {
      where.region = { equals: region, mode: 'insensitive' };
    }

    if (maxCost !== undefined) {
      where.costIndex = { lte: maxCost };
    }

    // 3. Build Prisma `orderBy` clause
    let orderBy = { popularityScore: 'desc' };
    if (sortBy === 'cost_asc') {
      orderBy = { costIndex: 'asc' };
    } else if (sortBy === 'cost_desc') {
      orderBy = { costIndex: 'desc' };
    } else if (sortBy === 'name_asc') {
      orderBy = { name: 'asc' };
    }

    // 4. Pagination calculation
    const skip = (page - 1) * limit;

    // 5. Query database in parallel
    const [destinations, total] = await Promise.all([
      prisma.city.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.city.count({ where }),
    ]);

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

module.exports = {
  getTopRegionalDestinations,
};
