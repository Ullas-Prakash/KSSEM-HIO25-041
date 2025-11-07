const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  short_description: {
    type: String,
    required: true,
  },
  benefits: {
    type: String,
    required: true,
  },
  eligibility_summary: {
    type: String,
    required: true,
  },
  
  // Enhanced categorization
  category: {
    type: String,
    required: true,
    enum: ['Education', 'Health', 'Girl Child', 'Senior Women', 'Widows', 'Rural Women', 'Women Farmers', 'Employment', 'Entrepreneurship', 'Housing', 'Financial Assistance', 'Skill Development', 'Social Security'],
  },
  
  scheme_type: {
    type: String,
    enum: ['Subsidy', 'Grant', 'Loan', 'Pension', 'Insurance', 'Training', 'Scholarship', 'Direct Benefit Transfer', 'Tax Benefit', 'Other'],
    default: 'Other',
  },
  
  level: {
    type: String,
    required: true,
    enum: ['Central', 'State', 'District', 'Local'],
  },
  
  state_ut: {
    type: String,
    required: true,
  },
  
  // Financial details
  financial_assistance: {
    amount: String,
    frequency: {
      type: String,
      enum: ['One-time', 'Monthly', 'Quarterly', 'Yearly', 'As per need'],
    },
    max_amount: String,
    funding_source: String,
  },
  
  // Detailed eligibility criteria
  eligibility_criteria: {
    age_min: Number,
    age_max: Number,
    gender: {
      type: String,
      enum: ['Female', 'All', 'Transgender'],
      default: 'Female',
    },
    income_limit: String,
    caste_category: [String], // General, SC, ST, OBC, etc.
    marital_status: [String], // Single, Married, Widow, Divorced
    education_level: String,
    occupation: [String],
    land_holding: String,
    bpl_card_required: Boolean,
    other_criteria: [String],
  },
  
  // Documents required
  required_documents: [{
    document_name: String,
    is_mandatory: Boolean,
    description: String,
  }],
  
  // Application process
  application_process: {
    steps: [String],
    processing_time: String,
    fees: String,
    helpline_number: String,
    helpline_email: String,
  },
  
  ministry_department: {
    type: String,
    required: true,
  },
  
  implementing_agency: {
    type: String,
  },
  
  official_url: {
    type: String,
  },
  
  application_mode: {
    type: String,
    enum: ['Online', 'Offline', 'Both'],
  },
  
  application_portal_url: {
    type: String,
  },
  
  // AI-generated fields
  ai_classification: {
    primary_category: String,
    secondary_categories: [String],
    target_beneficiaries: [String],
    keywords: [String],
    confidence_score: Number,
  },
  
  // Status and tracking
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended', 'Closed'],
    default: 'Active',
  },
  
  launch_date: Date,
  end_date: Date,
  
  last_verified_on: {
    type: Date,
    default: Date.now,
  },
  
  verified_by: String,
  
  // Statistics
  stats: {
    total_beneficiaries: Number,
    budget_allocated: String,
    budget_utilized: String,
  },
}, {
  timestamps: true,
});

// Indexes for better search performance
schemeSchema.index({ name: 'text', short_description: 'text', benefits: 'text' });
schemeSchema.index({ category: 1, state_ut: 1 });

module.exports = mongoose.model('Scheme', schemeSchema);
