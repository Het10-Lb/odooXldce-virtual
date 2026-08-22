const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const uploadController = require('../controllers/uploadController');
const { verifyToken } = require('../middleware/authMiddleware');

// All upload routes require authentication
router.use(verifyToken);

/**
 * @route   POST /api/upload/image
 * @desc    General single image upload (returns uploaded asset URL)
 * @access  Private
 */
router.post('/image', upload.single('image'), uploadController.uploadGeneralImage);

/**
 * @route   POST /api/upload/trip-cover/:tripId
 * @desc    Upload & update cover photo for a specific Trip
 * @access  Private
 */
router.post('/trip-cover/:tripId', upload.single('image'), uploadController.uploadTripCover);

/**
 * @route   POST /api/upload/avatar
 * @desc    Upload & update user profile picture
 * @access  Private
 */
router.post('/avatar', upload.single('image'), uploadController.uploadAvatar);

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple images (up to 5 for community post galleries)
 * @access  Private
 */
router.post('/multiple', upload.array('images', 5), uploadController.uploadMultipleImages);

module.exports = router;
