const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/destinations/top-regional
 * @desc    Get top regional destinations with dynamic search, filter, sort & pagination
 * @access  Public
 */
router.get('/top-regional', destinationController.getTopRegionalDestinations);

/**
 * @route   GET /api/destinations/regions
 * @desc    Get list of unique available regions
 * @access  Public
 */
router.get('/regions', destinationController.getRegions);

/**
 * @route   GET /api/destinations/:id
 * @desc    Get detailed destination by ID
 * @access  Public
 */
router.get('/:id', destinationController.getDestinationById);

/**
 * @route   POST /api/destinations/:id/save
 * @desc    Toggle Save / Favorite a city
 * @access  Private
 */
router.post('/:id/save', verifyToken, destinationController.toggleSaveCity);

module.exports = router;
