const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/trips/my-trips
 * @desc    Get user's trips with search, status filter, sorting, pagination, and grouping
 * @access  Private
 */
router.get('/my-trips', verifyToken, tripController.getMyTrips);

module.exports = router;
