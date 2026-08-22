const { verifyAccessToken } = require('../utils/jwt');
const prisma = require('../config/prisma');

/**
 * Middleware to protect private routes via Authorization header (Bearer token)
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing or invalid format. Header should be Authorization: Bearer <token>',
      });
    }

    const token = authHeader.split(' ')[1];
    
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Access token has expired. Please refresh your token.',
          code: 'TOKEN_EXPIRED',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid access token.',
      });
    }

    // Real-world database verification: Check user existence and active status
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        city: true,
        country: true,
        phoneNumber: true,
        photoUrl: true,
        languagePreference: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: User belonging to this token no longer exists.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: User account has been deactivated.',
      });
    }

    // Attach complete real-world user object to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional Auth Middleware: Attaches req.user if valid token provided, but does not block request if missing
 */
const optionalVerifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          city: true,
          country: true,
          role: true,
          isActive: true,
        },
      });

      if (user && user.isActive) {
        req.user = user;
      }
    } catch (ignored) {
      // Proceed without req.user for optional auth
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware for Role-Based Access Control (RBAC)
 * @param  {...string} roles Allowed roles (e.g. 'ADMIN', 'USER')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to perform this action.',
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  optionalVerifyToken,
  authorizeRoles,
};
