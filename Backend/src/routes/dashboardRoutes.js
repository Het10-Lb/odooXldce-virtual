const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/dashboard/landing
 * @desc    Get combined dashboard landing screen data (active trip, top regional cities, stats)
 * @access  Private
 */
router.get('/landing', verifyToken, dashboardController.getLandingData);

module.exports = router;
