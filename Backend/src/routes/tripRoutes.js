const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const sectionController = require('../controllers/sectionController');
const { verifyToken } = require('../middleware/authMiddleware');

// All trip routes are protected by verifyToken middleware
router.use(verifyToken);

/**
 * Trip Initialization & Listing Routes
 */

// POST /api/trips - Create new trip (Screen 4)
router.post('/', tripController.createTrip);

// GET /api/trips/my-trips - List user trips with search/filter/grouping (Screen 6)
router.get('/my-trips', tripController.getMyTrips);

// GET /api/trips/sections/templates - Browse curated section packages / templates
router.get('/sections/templates', sectionController.getSectionTemplates);

// GET /api/trips/:id - Get trip details & full itinerary
router.get('/:id', tripController.getTripById);

// GET /api/trips/:id/suggestions - Get activity suggestions catalog for planning
router.get('/:id/suggestions', tripController.getTripSuggestions);

/**
 * Section / Stop Management & Predefined Template Package Routes (Screen 5 & 9)
 */

// POST /api/trips/:id/sections/attach-template - Attach & clone a predefined section package directly into a trip
router.post('/:id/sections/attach-template', sectionController.attachTemplateSection);

// POST /api/trips/:id/sections - Add custom section/stop to trip
router.post('/:id/sections', sectionController.createSection);

// GET /api/trips/:id/sections - Get ordered list of sections for trip
router.get('/:id/sections', sectionController.getSections);

// PUT /api/trips/:id/sections/reorder - Batch reorder sections or items via $transaction
router.put('/:id/sections/reorder', sectionController.reorderItinerary);

// PUT /api/trips/:id/sections/:sectionId - Update section metadata & sync budget
router.put('/:id/sections/:sectionId', sectionController.updateSection);

// DELETE /api/trips/:id/sections/:sectionId - Delete section & cascade items
router.delete('/:id/sections/:sectionId', sectionController.deleteSection);

/**
 * Itinerary Items Management Routes
 */

// POST /api/trips/:id/sections/:sectionId/items - Add activity, transport, stay or meal to section
router.post('/:id/sections/:sectionId/items', sectionController.addItemToSection);

module.exports = router;
