const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');

// Public routes - no authentication required
router.get('/', schemeController.getSchemes);
router.get('/categories', schemeController.getCategories);
router.get('/states', schemeController.getStates);
router.get('/:id', schemeController.getSchemeById);

// AI-powered routes
router.post('/ai/recommendations', schemeController.getRecommendations);
router.post('/ai/search', schemeController.naturalSearch);
router.post('/ai/eligibility', schemeController.checkEligibility);
router.get('/ai/documents/:id', schemeController.getDocumentGuidance);
router.post('/ai/ask', schemeController.askQuestion);

module.exports = router;
