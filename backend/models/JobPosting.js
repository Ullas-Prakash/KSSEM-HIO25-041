const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmployerProfile',
    required: true
  },
  jobDetails: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    responsibilities: [{
      type: String,
      trim: true
    }],
    requirements: {
      skills: [{
        type: String,
        trim: true
      }],
      education: {
        type: String,
        enum: ['10th', '12th', 'Diploma', 'Graduate', 'Post-Graduate', 'Any'],
        default: 'Any'
      },
      experience: {
        min: {
          type: Number,
          min: 0,
          default: 0
        },
        max: {
          type: Number,
          min: 0
        }
      }
    }
  },
  jobInfo: {
    type: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Freelance', 'Remote', 'Contract'],
      required: true
    },
    location: {
      city: {
        type: String,
        trim: true
      },
      state: {
        type: String,
        trim: true
      },
      country: {
        type: String,
        trim: true,
        default: 'India'
      },
      isRemote: {
        type: Boolean,
        default: false
      }
    },
    salary: {
      min: {
        type: Number,
        min: 0
      },
      max: {
        type: Number,
        min: 0
      },
      currency: {
        type: String,
        default: 'INR'
      },
      isNegotiable: {
        type: Boolean,
        default: false
      }
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'inactive'],
    default: 'active'
  },
  applicationCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
jobPostingSchema.index({ employer: 1 });
jobPostingSchema.index({ status: 1, postedAt: -1 });
jobPostingSchema.index({ 'jobDetails.requirements.skills': 1 });
jobPostingSchema.index({ 'jobInfo.location.city': 1 });
jobPostingSchema.index({ 'jobInfo.type': 1 });

// Method to check if job is active
jobPostingSchema.methods.isActive = function() {
  return this.status === 'active' && (!this.expiresAt || this.expiresAt > new Date());
};

// Method to increment view count
jobPostingSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Method to increment application count
jobPostingSchema.methods.incrementApplicationCount = function() {
  this.applicationCount += 1;
  return this.save();
};

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

module.exports = JobPosting;
