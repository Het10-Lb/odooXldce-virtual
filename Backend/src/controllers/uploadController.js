const prisma = require('../config/prisma');

/**
 * @desc    General single image upload (activity photo, general asset)
 * @route   POST /api/upload/image
 * @access  Private (Protected by verifyToken)
 */
const uploadGeneralImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image file provided.',
    });
  }

  const host = req.get('host');
  const protocol = req.protocol;
  const relativePath = `/uploads/${req.file.filename}`;
  const fullUrl = `${protocol}://${host}${relativePath}`;

  return res.status(200).json({
    success: true,
    message: 'Image uploaded successfully.',
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      relativePath,
      url: fullUrl,
    },
  });
};

/**
 * @desc    Upload & update Trip cover photo
 * @route   POST /api/upload/trip-cover/:tripId
 * @access  Private (Protected by verifyToken)
 */
const uploadTripCover = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { tripId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No trip cover image file provided.',
      });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found.',
      });
    }

    if (trip.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this trip cover.',
      });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const relativePath = `/uploads/${req.file.filename}`;
    const fullUrl = `${protocol}://${host}${relativePath}`;

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        coverPhotoUrl: fullUrl,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Trip cover photo updated successfully.',
      data: {
        tripId: updatedTrip.id,
        coverPhotoUrl: updatedTrip.coverPhotoUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload & update User profile avatar
 * @route   POST /api/upload/avatar
 * @access  Private (Protected by verifyToken)
 */
const uploadAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No avatar image file provided.',
      });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const relativePath = `/uploads/${req.file.filename}`;
    const fullUrl = `${protocol}://${host}${relativePath}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        photoUrl: fullUrl,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        photoUrl: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'User avatar updated successfully.',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload multiple images (up to 5 for community posts)
 * @route   POST /api/upload/multiple
 * @access  Private (Protected by verifyToken)
 */
const uploadMultipleImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No image files provided.',
    });
  }

  const host = req.get('host');
  const protocol = req.protocol;

  const uploadedFiles = req.files.map((file) => {
    const relativePath = `/uploads/${file.filename}`;
    return {
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      relativePath,
      url: `${protocol}://${host}${relativePath}`,
    };
  });

  return res.status(200).json({
    success: true,
    message: `${uploadedFiles.length} images uploaded successfully.`,
    data: {
      files: uploadedFiles,
      urls: uploadedFiles.map((f) => f.url),
    },
  });
};

module.exports = {
  uploadGeneralImage,
  uploadTripCover,
  uploadAvatar,
  uploadMultipleImages,
};
