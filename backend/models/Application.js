const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CandidateProfile',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true
  },
  coverLetter: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'rejected', 'interview_scheduled', 'hired'],
    default: 'pending'
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'rejected', 'interview_scheduled', 'hired']
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true
});

// Unique compound index to prevent duplicate applications
applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ candidate: 1, appliedAt: -1 });

// Method to update status with history tracking
applicationSchema.methods.updateStatus = function(newStatus, changedBy, notes = '') {
  this.statusHistory.push({
    status: newStatus,
    changedAt: new Date(),
    changedBy,
    notes
  });
  this.status = newStatus;
  return this.save();
};

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
