const Scheme = require('../models/Scheme');
const geminiService = require('../services/geminiService');

// Get all schemes with filters
exports.getSchemes = async (req, res) => {
  try {
    const { category, state_ut, level, search } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (state_ut) query.state_ut = state_ut;
    if (level) query.level = level;
    if (search) {
      query.$text = { $search: search };
    }
    
    const schemes = await Scheme.find(query).sort({ name: 1 });
    
    res.json({
      success: true,
      count: schemes.length,
      schemes,
    });
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch schemes',
    });
  }
};

// Get single scheme by ID
exports.getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: 'Scheme not found',
      });
    }
    
    res.json({
      success: true,
      scheme,
    });
  } catch (error) {
    console.error('Error fetching scheme:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scheme',
    });
  }
};

// Get unique categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Scheme.distinct('category');
    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
    });
  }
};

// Get unique states
exports.getStates = async (req, res) => {
  try {
    const states = await Scheme.distinct('state_ut');
    res.json({
      success: true,
      states: states.sort(),
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch states',
    });
  }
};


// AI-powered recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const userProfile = req.body;
    const allSchemes = await Scheme.find();
    
    const recommendedNames = await geminiService.getSchemeRecommendations(userProfile, allSchemes);
    
    const recommendedSchemes = allSchemes.filter(scheme => 
      recommendedNames.includes(scheme.name)
    );
    
    res.json({
      success: true,
      recommendations: recommendedSchemes,
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations',
    });
  }
};

// Natural language search
exports.naturalSearch = async (req, res) => {
  try {
    const { query } = req.body;
    const allSchemes = await Scheme.find();
    
    const matchingNames = await geminiService.naturalLanguageSearch(query, allSchemes);
    
    const matchingSchemes = allSchemes.filter(scheme => 
      matchingNames.includes(scheme.name)
    );
    
    res.json({
      success: true,
      query,
      schemes: matchingSchemes,
    });
  } catch (error) {
    console.error('Error in natural search:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process natural language search',
    });
  }
};

// Check eligibility
exports.checkEligibility = async (req, res) => {
  try {
    const { schemeId, userInfo } = req.body;
    const scheme = await Scheme.findById(schemeId);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: 'Scheme not found',
      });
    }
    
    const eligibility = await geminiService.checkEligibility(userInfo, scheme);
    
    res.json({
      success: true,
      eligibility,
    });
  } catch (error) {
    console.error('Error checking eligibility:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check eligibility',
    });
  }
};

// Get document guidance
exports.getDocumentGuidance = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: 'Scheme not found',
      });
    }
    
    const guidance = await geminiService.getDocumentGuidance(scheme);
    
    res.json({
      success: true,
      guidance,
    });
  } catch (error) {
    console.error('Error getting document guidance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get document guidance',
    });
  }
};

// Ask question about scheme
exports.askQuestion = async (req, res) => {
  try {
    const { schemeId, question } = req.body;
    const scheme = await Scheme.findById(schemeId);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: 'Scheme not found',
      });
    }
    
    const answer = await geminiService.askQuestion(question, scheme);
    
    res.json({
      success: true,
      question,
      answer,
    });
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to answer question',
    });
  }
};
