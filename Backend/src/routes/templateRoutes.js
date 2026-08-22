const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { verifyToken, optionalVerifyToken } = require('../middleware/authMiddleware');

/**
 * Public / Optional Auth Routes
 */

// GET /api/templates - Browse curated trip templates (filter by state, maxBudget, durationDays)
router.get('/', optionalVerifyToken, templateController.getTemplates);

// GET /api/templates/:id - Get template details
router.get('/:id', optionalVerifyToken, templateController.getTemplateById);

/**
 * Protected Routes
 */

// POST /api/templates/:templateId/create-trip - Create trip from template
router.post('/:templateId/create-trip', verifyToken, templateController.createTripFromTemplate);

// POST /api/templates/:templateId/clone - Alias for create-trip
router.post('/:templateId/clone', verifyToken, templateController.createTripFromTemplate);

module.exports = router;
