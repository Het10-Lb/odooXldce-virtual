const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { generateRandomToken, hashToken } = require('../utils/crypto');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} = require('../validators/authValidator');

/**
 * Helper to strip sensitive password field from user object
 */
const sanitizeUser = (user) => {
  const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
  return safeUser;
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    // 1. Validate request body
    const validatedData = registerSchema.parse(req.body);

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // 3. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // 4. Create user in database
    const newUser = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: hashedPassword,
        phoneNumber: validatedData.phoneNumber || null,
        photoUrl: validatedData.photoUrl || null,
        city: validatedData.city || null,
        country: validatedData.country || null,
        languagePreference: validatedData.languagePreference || 'en',
      },
    });

    // 5. Generate tokens
    const tokenPayload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ id: newUser.id });

    // 6. Save Refresh Token in database (expires in 7 days)
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: newUser.id,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    // 7. Return user profile and tokens
    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: sanitizeUser(newUser),
        tokens: {
          accessToken,
          refreshToken,
          tokenType: 'Bearer',
          expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get tokens
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    // 1. Validate body
    const { email, password } = loginSchema.parse(req.body);

    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 4. Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // 5. Generate tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ id: user.id });

    // 6. Save Refresh Token in database
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: sanitizeUser(user),
        tokens: {
          accessToken,
          refreshToken,
          tokenType: 'Bearer',
          expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Initiate password reset (Sends reset link simulation)
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    // 1. Validate request
    const { email } = forgotPasswordSchema.parse(req.body);

    const genericSuccessResponse = {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent to your email.',
    };

    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Return generic success if user does not exist to prevent email enumeration
    if (!user || !user.isActive) {
      return res.status(200).json(genericSuccessResponse);
    }

    // 3. Generate raw reset token & hash it
    const rawResetToken = generateRandomToken(32);
    const hashedResetToken = hashToken(rawResetToken);
    
    // Set 1-hour expiration
    const resetExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

    // 4. Save hashed token & expiry in user record
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedResetToken,
        resetPasswordExpires: resetExpiresAt,
      },
    });

    // 5. Construct reset URL for simulation / email dispatch
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password/${rawResetToken}`;

    console.log('----------------------------------------------------');
    console.log(`[EMAIL SIMULATION] Password Reset Request for ${user.email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token Expires At: ${resetExpiresAt.toISOString()}`);
    console.log('----------------------------------------------------');

    const response = { ...genericSuccessResponse };

    // Include resetUrl in development mode for easy API testing
    if (process.env.NODE_ENV !== 'production') {
      response.devDebug = {
        resetUrl,
        rawResetToken,
        expiresAt: resetExpiresAt,
      };
    }

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password using reset token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const rawToken = req.params.token;
    if (!rawToken) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is required.',
      });
    }

    // 1. Validate new password
    const { password } = resetPasswordSchema.parse(req.body);

    // 2. Hash incoming raw token to compare against stored hash
    const hashedToken = hashToken(rawToken);

    // 3. Find user with valid matching reset token & non-expired time
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
      });
    }

    // 4. Hash new password
    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(password, saltRounds);

    // 5. Update user password and clear reset fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: newHashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    // 6. Revoke existing refresh tokens for security
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Rotate refresh token and issue fresh Access Token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
const refreshToken = async (req, res, next) => {
  try {
    // 1. Validate input
    const { refreshToken: incomingToken } = refreshTokenSchema.parse(req.body);

    // 2. Verify JWT signature
    let decoded;
    try {
      decoded = verifyRefreshToken(incomingToken);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token signature.',
      });
    }

    // 3. Find refresh token record in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: incomingToken },
      include: { user: true },
    });

    if (!storedToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not recognized or already revoked.',
      });
    }

    // 4. Check expiration in DB
    if (new Date(storedToken.expiresAt) < new Date()) {
      // Clean up expired token
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      return res.status(401).json({
        success: false,
        message: 'Refresh token has expired. Please log in again.',
      });
    }

    // 5. Check user status
    if (!storedToken.user || !storedToken.user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account associated with this token is inactive.',
      });
    }

    // 6. Token Rotation: Delete old refresh token
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // 7. Issue new Access Token and new Refresh Token
    const tokenPayload = {
      id: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken({ id: storedToken.user.id });

    // Store new refresh token in DB
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: storedToken.user.id,
        expiresAt: newExpiresAt,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Tokens rotated successfully.',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        tokenType: 'Bearer',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private (Protected by verifyToken)
 */
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
  getMe,
};
