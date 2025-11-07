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

// Enhanced AI routes
router.post('/ai/eligibility-detailed', schemeController.checkDetailedEligibility);
router.get('/ai/documents-enhanced/:id', schemeController.getEnhancedDocuments);
router.get('/ai/similar/:id', schemeController.getSimilarSchemes);
router.post('/ai/application-guidance', schemeController.getApplicationGuidance);
router.post('/ai/personalized-recommendations', schemeController.getPersonalizedRecommendations);
router.post('/ai/classify/:id', schemeController.autoClassifyScheme);

module.exports = router;
