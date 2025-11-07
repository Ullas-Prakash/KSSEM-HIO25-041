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
  category: {
    type: String,
    required: true,
    enum: ['Education', 'Health', 'Girl Child', 'Senior Women', 'Widows', 'Rural Women', 'Women Farmers'],
  },
  level: {
    type: String,
    required: true,
    enum: ['Central', 'State'],
  },
  state_ut: {
    type: String,
    required: true,
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
  last_verified_on: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for better search performance
schemeSchema.index({ name: 'text', short_description: 'text', benefits: 'text' });
schemeSchema.index({ category: 1, state_ut: 1 });

module.exports = mongoose.model('Scheme', schemeSchema);
