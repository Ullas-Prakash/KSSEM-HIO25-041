const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const getModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

// Automatically classify and enrich scheme data using AI
exports.classifyScheme = async (schemeData) => {
  try {
    const model = getModel();
    
    const prompt = `You are an expert in Indian government welfare schemes. Analyze this scheme and provide detailed classification.

Scheme Information:
Name: ${schemeData.name}
Description: ${schemeData.short_description || schemeData.description}
Benefits: ${schemeData.benefits}
Category: ${schemeData.category || 'Not specified'}
Ministry: ${schemeData.ministry_department || 'Not specified'}

Provide a JSON response with:
{
  "scheme_type": "Subsidy|Grant|Loan|Pension|Insurance|Training|Scholarship|Direct Benefit Transfer|Tax Benefit|Other",
  "primary_category": "Main category from: Education, Health, Girl Child, Senior Women, Widows, Rural Women, Women Farmers, Employment, Entrepreneurship, Housing, Financial Assistance, Skill Development, Social Security",
  "secondary_categories": ["Additional relevant categories"],
  "target_beneficiaries": ["Specific groups who benefit"],
  "keywords": ["Important keywords for search"],
  "eligibility_hints": {
    "age_range": "e.g., 18-60 or null",
    "income_level": "e.g., Below Poverty Line, Below 3 lakhs, etc.",
    "occupation": ["e.g., Farmer, Student, Unemployed"],
    "marital_status": ["e.g., Widow, Single, Any"],
    "education": "Minimum education level or null"
  },
  "financial_details": {
    "amount": "Amount if mentioned",
    "frequency": "One-time|Monthly|Quarterly|Yearly|As per need",
    "max_amount": "Maximum amount if applicable"
  },
  "confidence_score": 0.0-1.0
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return null;
  } catch (error) {
    console.error('Error classifying scheme:', error);
    return null;
  }
};

// Advanced eligibility checking with detailed analysis
exports.checkDetailedEligibility = async (userProfile, scheme) => {
  try {
    const model = getModel();
    
    const prompt = `You are an expert eligibility assessor for Indian government welfare schemes.

Scheme Details:
Name: ${scheme.name}
Category: ${scheme.category}
Type: ${scheme.scheme_type || 'Not specified'}
Eligibility Summary: ${scheme.eligibility_summary}
${scheme.eligibility_criteria ? `
Detailed Criteria:
- Age: ${scheme.eligibility_criteria.age_min || 'Any'} - ${scheme.eligibility_criteria.age_max || 'Any'}
- Income Limit: ${scheme.eligibility_criteria.income_limit || 'Not specified'}
- Marital Status: ${scheme.eligibility_criteria.marital_status?.join(', ') || 'Any'}
- Occupation: ${scheme.eligibility_criteria.occupation?.join(', ') || 'Any'}
- Education: ${scheme.eligibility_criteria.education_level || 'Any'}
` : ''}

User Profile:
${JSON.stringify(userProfile, null, 2)}

Analyze eligibility comprehensively and provide:
{
  "eligible": true|false,
  "confidence": 0.0-1.0,
  "status": "Fully Eligible|Partially Eligible|Not Eligible|Insufficient Information",
  "matching_criteria": ["List criteria that match"],
  "missing_criteria": ["List criteria that don't match or are missing"],
  "required_information": ["Additional info needed to confirm eligibility"],
  "recommendations": ["Specific actions user should take"],
  "explanation": "Clear 2-3 sentence explanation in supportive tone",
  "next_steps": ["Concrete steps to apply if eligible"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      eligible: false,
      confidence: 0,
      status: 'Insufficient Information',
      explanation: 'Unable to determine eligibility',
      matching_criteria: [],
      missing_criteria: [],
      required_information: [],
      recommendations: [],
      next_steps: []
    };
  } catch (error) {
    console.error('Error checking detailed eligibility:', error);
    return {
      eligible: false,
      confidence: 0,
      status: 'Error',
      explanation: 'Unable to check eligibility at this time',
      matching_criteria: [],
      missing_criteria: [],
      required_information: [],
      recommendations: [],
      next_steps: []
    };
  }
};

// Extract and structure document requirements
exports.extractDocumentRequirements = async (scheme) => {
  try {
    const model = getModel();
    
    const prompt = `You are an expert in Indian government documentation requirements.

Scheme: ${scheme.name}
Category: ${scheme.category}
Type: ${scheme.scheme_type || 'General'}
Eligibility: ${scheme.eligibility_summary}
State: ${scheme.state_ut}
Level: ${scheme.level}

List ALL documents typically required for this type of scheme. Be comprehensive and specific to Indian government schemes.

Return JSON:
{
  "mandatory_documents": [
    {
      "name": "Document name",
      "purpose": "Why needed",
      "how_to_obtain": "Where/how to get it",
      "validity": "Validity period if applicable",
      "alternatives": ["Alternative documents if any"]
    }
  ],
  "optional_documents": [
    {
      "name": "Document name",
      "purpose": "Why it helps",
      "how_to_obtain": "Where/how to get it"
    }
  ],
  "general_tips": ["Important tips for documentation"],
  "common_mistakes": ["Common mistakes to avoid"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      mandatory_documents: [],
      optional_documents: [],
      general_tips: [],
      common_mistakes: []
    };
  } catch (error) {
    console.error('Error extracting documents:', error);
    return {
      mandatory_documents: [],
      optional_documents: [],
      general_tips: [],
      common_mistakes: []
    };
  }
};

// Find similar schemes
exports.findSimilarSchemes = async (scheme, allSchemes) => {
  try {
    const model = getModel();
    
    const prompt = `You are an expert in Indian government welfare schemes.

Current Scheme: ${scheme.name}
Category: ${scheme.category}
Benefits: ${scheme.benefits}

Available Schemes:
${JSON.stringify(allSchemes.map(s => ({ 
  name: s.name, 
  category: s.category, 
  type: s.scheme_type,
  benefits: s.benefits 
})).slice(0, 50), null, 2)}

Find the top 5 most similar schemes that a user might also be interested in. Consider:
- Similar benefits
- Same target audience
- Complementary schemes
- Alternative options

Return ONLY a JSON array of scheme names:
["Scheme Name 1", "Scheme Name 2", ...]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return [];
  } catch (error) {
    console.error('Error finding similar schemes:', error);
    return [];
  }
};

// Generate application guidance
exports.generateApplicationGuidance = async (scheme, userProfile) => {
  try {
    const model = getModel();
    
    const prompt = `You are a helpful guide for Indian government scheme applications.

Scheme: ${scheme.name}
Application Mode: ${scheme.application_mode || 'Not specified'}
${scheme.application_process ? `
Process: ${JSON.stringify(scheme.application_process)}
` : ''}

User Profile: ${JSON.stringify(userProfile, null, 2)}

Provide step-by-step application guidance tailored to this user. Be specific, encouraging, and practical.

Return JSON:
{
  "preparation_steps": ["What to do before applying"],
  "application_steps": ["Detailed step-by-step process"],
  "timeline": "Expected timeline",
  "tips": ["Helpful tips for successful application"],
  "common_issues": ["Common problems and solutions"],
  "support_contacts": ["Where to get help"],
  "follow_up": ["What to do after applying"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      preparation_steps: [],
      application_steps: [],
      timeline: 'Not available',
      tips: [],
      common_issues: [],
      support_contacts: [],
      follow_up: []
    };
  } catch (error) {
    console.error('Error generating application guidance:', error);
    return {
      preparation_steps: [],
      application_steps: [],
      timeline: 'Not available',
      tips: [],
      common_issues: [],
      support_contacts: [],
      follow_up: []
    };
  }
};

// Personalized scheme recommendations
exports.getPersonalizedRecommendations = async (userProfile, allSchemes) => {
  try {
    const model = getModel();
    
    const prompt = `You are an expert advisor for Indian government welfare schemes for women.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Available Schemes (showing first 30):
${JSON.stringify(allSchemes.slice(0, 30).map(s => ({
  name: s.name,
  category: s.category,
  type: s.scheme_type,
  benefits: s.benefits,
  eligibility: s.eligibility_summary,
  state: s.state_ut
})), null, 2)}

Analyze the user's profile and recommend the top 10 most relevant schemes. Consider:
- User's location, age, occupation, income
- Immediate needs vs long-term benefits
- Ease of application
- Maximum benefit potential

Return JSON:
{
  "recommendations": [
    {
      "scheme_name": "Name",
      "relevance_score": 0.0-1.0,
      "reason": "Why this is recommended",
      "priority": "High|Medium|Low",
      "estimated_benefit": "What user will get"
    }
  ],
  "overall_advice": "General advice for the user"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      recommendations: [],
      overall_advice: ''
    };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return {
      recommendations: [],
      overall_advice: ''
    };
  }
};

module.exports = exports;
