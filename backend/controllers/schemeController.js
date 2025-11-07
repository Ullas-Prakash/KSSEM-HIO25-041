const Scheme = require('../models/Scheme');
const geminiService = require('../services/geminiService');
const enhancedGeminiService = require('../services/enhancedGeminiService');

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


// Enhanced eligibility check with detailed analysis
exports.checkDetailedEligibility = async (req, res) => {
  try {
    const { schemeId, userProfile } = req.body;
    const scheme = await Scheme.findById(schemeId);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: 'Scheme not found',
      });
    }
    
    const eligibility = await enhancedGeminiService.checkDetailedEligibility(userProfile, scheme);
    
    res.json({
      success: true,
      eligibility,
    });
  } catch (error) {
    console.error('Error checking detailed eligibility:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check eligibility',
    });
  }
};

// Get enhanced document requirements
exports.getEnhancedDocuments = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: 'Scheme not found',
      });
    }
    
    const documents = await enhancedGeminiService.extractDocumentRequirements(scheme);
    
    res.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error('Error getting enhanced documents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get document requirements',
    });
  }
};

// Get similar schemes
exports.getSimilarSchemes = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: 'Scheme not found',
      });
    }
    
    const allSchemes = await Scheme.find({ _id: { $ne: scheme._id } });
    const similarNames = await enhancedGeminiService.findSimilarSchemes(scheme, allSchemes);
    
    const similarSchemes = allSchemes.filter(s => similarNames.includes(s.name));
    
    res.json({
      success: true,
      similar_schemes: similarSchemes,
    });
  } catch (error) {
    console.error('Error getting similar schemes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get similar schemes',
    });
  }
};

// Get application guidance
exports.getApplicationGuidance = async (req, res) => {
  try {
    const { schemeId, userProfile } = req.body;
    const scheme = await Scheme.findById(schemeId);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: 'Scheme not found',
      });
    }
    
    const guidance = await enhancedGeminiService.generateApplicationGuidance(scheme, userProfile);
    
    res.json({
      success: true,
      guidance,
    });
  } catch (error) {
    console.error('Error getting application guidance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get application guidance',
    });
  }
};

// Get personalized recommendations
exports.getPersonalizedRecommendations = async (req, res) => {
  try {
    const userProfile = req.body;
    const allSchemes = await Scheme.find({ status: 'Active' });
    
    const recommendations = await enhancedGeminiService.getPersonalizedRecommendations(userProfile, allSchemes);
    
    // Get full scheme details for recommended schemes
    const recommendedSchemes = [];
    for (const rec of recommendations.recommendations) {
      const scheme = allSchemes.find(s => s.name === rec.scheme_name);
      if (scheme) {
        recommendedSchemes.push({
          ...scheme.toObject(),
          recommendation: rec
        });
      }
    }
    
    res.json({
      success: true,
      recommendations: recommendedSchemes,
      advice: recommendations.overall_advice,
    });
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations',
    });
  }
};

// Auto-classify scheme (admin function)
exports.autoClassifyScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: 'Scheme not found',
      });
    }
    
    const classification = await enhancedGeminiService.classifyScheme(scheme);
    
    if (classification) {
      // Update scheme with AI classification
      scheme.scheme_type = classification.scheme_type;
      scheme.ai_classification = {
        primary_category: classification.primary_category,
        secondary_categories: classification.secondary_categories,
        target_beneficiaries: classification.target_beneficiaries,
        keywords: classification.keywords,
        confidence_score: classification.confidence_score,
      };
      
      // Update eligibility criteria if hints provided
      if (classification.eligibility_hints) {
        if (!scheme.eligibility_criteria) {
          scheme.eligibility_criteria = {};
        }
        if (classification.eligibility_hints.occupation) {
          scheme.eligibility_criteria.occupation = classification.eligibility_hints.occupation;
        }
        if (classification.eligibility_hints.marital_status) {
          scheme.eligibility_criteria.marital_status = classification.eligibility_hints.marital_status;
        }
        if (classification.eligibility_hints.income_level) {
          scheme.eligibility_criteria.income_limit = classification.eligibility_hints.income_level;
        }
      }
      
      // Update financial details
      if (classification.financial_details) {
        if (!scheme.financial_assistance) {
          scheme.financial_assistance = {};
        }
        if (classification.financial_details.amount) {
          scheme.financial_assistance.amount = classification.financial_details.amount;
        }
        if (classification.financial_details.frequency) {
          scheme.financial_assistance.frequency = classification.financial_details.frequency;
        }
        if (classification.financial_details.max_amount) {
          scheme.financial_assistance.max_amount = classification.financial_details.max_amount;
        }
      }
      
      await scheme.save();
    }
    
    res.json({
      success: true,
      classification,
      updated_scheme: scheme,
    });
  } catch (error) {
    console.error('Error auto-classifying scheme:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to classify scheme',
    });
  }
};
