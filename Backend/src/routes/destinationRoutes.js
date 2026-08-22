const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

/**
 * @route   GET /api/destinations/top-regional
 * @desc    Get top regional destinations with dynamic search, filter, sort & pagination
 * @access  Public
 */
router.get('/top-regional', destinationController.getTopRegionalDestinations);

module.exports = router;
