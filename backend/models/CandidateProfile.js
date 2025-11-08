const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      min: 18,
      max: 100
    },
    phone: {
      type: String,
      trim: true
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
      }
    }
  },
  professionalInfo: {
    skills: [{
      type: String,
      trim: true
    }],
    education: {
      level: {
        type: String,
        enum: ['10th', '12th', 'Diploma', 'Graduate', 'Post-Graduate'],
        required: true
      },
      field: {
        type: String,
        trim: true
      },
      institution: {
        type: String,
        trim: true
      }
    },
    experience: {
      years: {
        type: Number,
        min: 0,
        default: 0
      },
      description: {
        type: String,
        trim: true
      }
    },
    resume: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    }
  },
  preferences: {
    jobTypes: [{
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Freelance', 'Remote', 'Contract']
    }],
    preferredLocations: [{
      type: String,
      trim: true
    }],
    expectedSalary: {
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
      }
    }
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
candidateProfileSchema.index({ user: 1 });
candidateProfileSchema.index({ 'professionalInfo.skills': 1 });
candidateProfileSchema.index({ 'professionalInfo.education.level': 1 });
candidateProfileSchema.index({ 'preferences.preferredLocations': 1 });
candidateProfileSchema.index({ isActive: 1, isProfileComplete: 1 });

// Virtual to check if profile has minimum required fields
candidateProfileSchema.methods.checkProfileCompletion = function() {
  const hasBasicInfo = this.personalInfo.fullName && 
                       this.personalInfo.location.city && 
                       this.personalInfo.location.state;
  
  const hasProfessionalInfo = this.professionalInfo.skills.length > 0 && 
                              this.professionalInfo.education.level;
  
  const hasPreferences = this.preferences.jobTypes.length > 0;
  
  return hasBasicInfo && hasProfessionalInfo && hasPreferences;
};

// Pre-save hook to update isProfileComplete
candidateProfileSchema.pre('save', function(next) {
  this.isProfileComplete = this.checkProfileCompletion();
  next();
});

const CandidateProfile = mongoose.model('CandidateProfile', candidateProfileSchema);

module.exports = CandidateProfile;
