const CandidateProfile = require('../models/CandidateProfile');
const User = require('../models/User');
const matchingService = require('../services/matchingService');
const fileStorageService = require('../services/fileStorageService');
const Application = require('../models/Application');
const Invitation = require('../models/Invitation');

/**
 * Create or update candidate profile
 */
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileData = req.body;

    // Check if profile exists
    let profile = await CandidateProfile.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      // Create new profile
      profile = new CandidateProfile({
        user: userId,
        ...profileData
      });
      await profile.save();

      // Update user role to candidate
      await User.findByIdAndUpdate(userId, { role: 'candidate' });
    }

    await profile.populate('user', 'displayName email photoURL');

    res.status(200).json({
      success: true,
      message: profile.isProfileComplete ? 'Profile updated successfully' : 'Profile created successfully',
      data: profile
    });
  } catch (error) {
    console.error('Error creating/updating candidate profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save profile',
      message: error.message
    });
  }
};

/**
 * Get own candidate profile
 */
exports.getOwnProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await CandidateProfile.findOne({ user: userId })
      .populate('user', 'displayName email photoURL');

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching candidate profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
};

/**
 * Get candidate profile by ID (for employers)
 */
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await CandidateProfile.findById(id)
      .populate('user', 'displayName photoURL');

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    // Hide sensitive information for employers
    const publicProfile = {
      _id: profile._id,
      personalInfo: {
        fullName: profile.personalInfo.fullName,
        age: profile.personalInfo.age,
        location: profile.personalInfo.location
      },
      professionalInfo: {
        skills: profile.professionalInfo.skills,
        education: profile.professionalInfo.education,
        experience: profile.professionalInfo.experience
      },
      preferences: profile.preferences,
      user: profile.user
    };

    res.status(200).json({
      success: true,
      data: publicProfile
    });
  } catch (error) {
    console.error('Error fetching candidate profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
};

/**
 * Upload resume
 */
exports.uploadResume = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Validate file type
    if (!fileStorageService.isValidFileType(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type. Only PDF and DOCX files are allowed'
      });
    }

    // Validate file size
    if (!fileStorageService.isValidFileSize(req.file.size)) {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 5MB limit'
      });
    }

    // Get candidate profile
    const profile = await CandidateProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Candidate profile not found. Please create a profile first'
      });
    }

    // Delete old resume if exists
    if (profile.professionalInfo.resume.fileUrl) {
      try {
        await fileStorageService.deleteResume(profile.professionalInfo.resume.fileUrl);
      } catch (error) {
        console.error('Error deleting old resume:', error);
      }
    }

    // Upload new resume
    const { fileName, fileUrl } = await fileStorageService.uploadResume(
      req.file.buffer,
      req.file.originalname,
      userId.toString()
    );

    // Update profile with resume info
    profile.professionalInfo.resume = {
      fileName,
      fileUrl,
      uploadedAt: new Date()
    };
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        fileName,
        uploadedAt: profile.professionalInfo.resume.uploadedAt
      }
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload resume',
      message: error.message
    });
  }
};

/**
 * Get resume download URL
 */
exports.getResumeUrl = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await CandidateProfile.findOne({ user: userId });
    if (!profile || !profile.professionalInfo.resume.fileUrl) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    const signedUrl = await fileStorageService.getSignedUrl(
      profile.professionalInfo.resume.fileUrl
    );

    res.status(200).json({
      success: true,
      data: {
        downloadUrl: signedUrl,
        fileName: profile.professionalInfo.resume.fileName,
        expiresIn: '1 hour'
      }
    });
  } catch (error) {
    console.error('Error getting resume URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get resume URL',
      message: error.message
    });
  }
};

/**
 * Delete resume
 */
exports.deleteResume = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await CandidateProfile.findOne({ user: userId });
    if (!profile || !profile.professionalInfo.resume.fileUrl) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    // Delete from storage
    await fileStorageService.deleteResume(profile.professionalInfo.resume.fileUrl);

    // Remove from profile
    profile.professionalInfo.resume = {
      fileName: null,
      fileUrl: null,
      uploadedAt: null
    };
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete resume',
      message: error.message
    });
  }
};

/**
 * Get matched jobs for candidate
 */
exports.getMatchedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    const profile = await CandidateProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Candidate profile not found'
      });
    }

    const matchedJobs = await matchingService.findMatchingJobs(profile._id, limit);

    res.status(200).json({
      success: true,
      data: matchedJobs
    });
  } catch (error) {
    console.error('Error getting matched jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get matched jobs',
      message: error.message
    });
  }
};

/**
 * Get candidate's applications
 */
exports.getApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const profile = await CandidateProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Candidate profile not found'
      });
    }

    const applications = await Application.find({ candidate: profile._id })
      .populate({
        path: 'job',
        populate: {
          path: 'employer',
          select: 'companyInfo.name companyInfo.logo'
        }
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments({ candidate: profile._id });

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting applications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get applications',
      message: error.message
    });
  }
};

/**
 * Get candidate's invitations
 */
exports.getInvitations = async (req, res) => {
  try {
    const userId = req.user._id;
    const status = req.query.status;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const profile = await CandidateProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Candidate profile not found'
      });
    }

    const query = { candidate: profile._id };
    if (status) {
      query.status = status;
    }

    const invitations = await Invitation.find(query)
      .populate({
        path: 'job',
        populate: {
          path: 'employer',
          select: 'companyInfo.name companyInfo.logo'
        }
      })
      .populate('employer', 'companyInfo.name')
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Invitation.countDocuments(query);

    res.status(200).json({
      success: true,
      data: invitations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting invitations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get invitations',
      message: error.message
    });
  }
};
