const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Initialize Gemini model
const getModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

// Smart scheme recommendations based on user profile
exports.getSchemeRecommendations = async (userProfile, allSchemes) => {
  try {
    const model = getModel();
    
    const prompt = `You are an expert in Indian government welfare schemes for women. 
    
User Profile:
- Age: ${userProfile.age || 'Not specified'}
- State: ${userProfile.state || 'Not specified'}
- Category: ${userProfile.category || 'Not specified'}
- Occupation: ${userProfile.occupation || 'Not specified'}
- Income Level: ${userProfile.income || 'Not specified'}
- Marital Status: ${userProfile.maritalStatus || 'Not specified'}

Available Schemes:
${JSON.stringify(allSchemes.map(s => ({ name: s.name, category: s.category, eligibility: s.eligibility_summary, state: s.state_ut })), null, 2)}

Based on the user profile, recommend the top 5 most relevant schemes. Return ONLY a JSON array of scheme names in order of relevance.
Format: ["Scheme Name 1", "Scheme Name 2", ...]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};

// Natural language search
exports.naturalLanguageSearch = async (query, allSchemes) => {
  try {
    const model = getModel();
    
    const prompt = `You are an expert in Indian government welfare schemes for women.

User Query: "${query}"

Available Schemes:
${JSON.stringify(allSchemes.map(s => ({ name: s.name, short_description: s.short_description, category: s.category, benefits: s.benefits })), null, 2)}

Based on the user's natural language query, identify which schemes are most relevant. Return ONLY a JSON array of scheme names that match the query.
Format: ["Scheme Name 1", "Scheme Name 2", ...]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return [];
  } catch (error) {
    console.error('Error in natural language search:', error);
    return [];
  }
};

// Check eligibility with AI
exports.checkEligibility = async (userInfo, scheme) => {
  try {
    const model = getModel();
    
    const prompt = `You are an expert in Indian government welfare schemes.

Scheme: ${scheme.name}
Eligibility Criteria: ${scheme.eligibility_summary}

User Information:
${JSON.stringify(userInfo, null, 2)}

Analyze if the user is likely eligible for this scheme. Provide:
1. Eligibility status (Likely Eligible / May Be Eligible / Not Eligible)
2. Brief explanation (2-3 sentences)
3. Missing information needed (if any)

Return ONLY a JSON object:
{
  "status": "Likely Eligible" | "May Be Eligible" | "Not Eligible",
  "explanation": "Brief explanation here",
  "missingInfo": ["info1", "info2"] or []
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      status: 'Unknown',
      explanation: 'Unable to determine eligibility',
      missingInfo: []
    };
  } catch (error) {
    console.error('Error checking eligibility:', error);
    return {
      status: 'Error',
      explanation: 'Unable to check eligibility at this time',
      missingInfo: []
    };
  }
};

// Get document requirements with AI explanation
exports.getDocumentGuidance = async (scheme) => {
  try {
    const model = getModel();
    
    const prompt = `You are an expert in Indian government welfare schemes and documentation.

Scheme: ${scheme.name}
Category: ${scheme.category}
Eligibility: ${scheme.eligibility_summary}
Level: ${scheme.level}
State: ${scheme.state_ut}

Based on this scheme, list the typical documents required to apply. Provide:
1. List of required documents
2. Brief explanation of why each document is needed
3. Tips for obtaining documents if not available

Return ONLY a JSON object:
{
  "documents": [
    {
      "name": "Document name",
      "purpose": "Why it's needed",
      "howToObtain": "Where/how to get it"
    }
  ],
  "generalTips": ["tip1", "tip2"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      documents: [],
      generalTips: []
    };
  } catch (error) {
    console.error('Error getting document guidance:', error);
    return {
      documents: [],
      generalTips: []
    };
  }
};

// AI-powered Q&A about schemes
exports.askQuestion = async (question, scheme) => {
  try {
    const model = getModel();
    
    const prompt = `You are an expert assistant helping women understand Indian government welfare schemes.

Scheme Details:
Name: ${scheme.name}
Description: ${scheme.short_description}
Benefits: ${scheme.benefits}
Eligibility: ${scheme.eligibility_summary}
Application Mode: ${scheme.application_mode}
Ministry: ${scheme.ministry_department}

User Question: "${question}"

Provide a clear, helpful answer in 2-3 sentences. Be encouraging and supportive.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error answering question:', error);
    return 'I apologize, but I am unable to answer that question at the moment. Please visit the official scheme website for more information.';
  }
};
