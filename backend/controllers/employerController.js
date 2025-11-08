const EmployerProfile = require('../models/EmployerProfile');
const User = require('../models/User');
const fileStorageService = require('../services/fileStorageService');
const Notification = require('../models/Notification');

/**
 * Create or update employer profile
 */
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileData = req.body;

    // Check if profile exists
    let profile = await EmployerProfile.findOne({ user: userId });

    if (profile) {
      // Update existing profile (preserve verification status)
      const { verification, ...updateData } = profileData;
      Object.assign(profile, updateData);
      await profile.save();
    } else {
      // Create new profile
      profile = new EmployerProfile({
        user: userId,
        ...profileData,
        verification: {
          status: 'pending'
        }
      });
      await profile.save();

      // Update user role to employer
      await User.findByIdAndUpdate(userId, { role: 'employer' });
    }

    await profile.populate('user', 'displayName email photoURL');

    res.status(200).json({
      success: true,
      message: 'Profile saved successfully',
      data: profile
    });
  } catch (error) {
    console.error('Error creating/updating employer profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save profile',
      message: error.message
    });
  }
};

/**
 * Get own employer profile
 */
exports.getOwnProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await EmployerProfile.findOne({ user: userId })
      .populate('user', 'displayName email photoURL')
      .populate('verification.verifiedBy', 'displayName');

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
    console.error('Error fetching employer profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
};

/**
 * Submit verification documents
 */
exports.submitVerification = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No documents uploaded'
      });
    }

    const profile = await EmployerProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Employer profile not found. Please create a profile first'
      });
    }

    // Upload documents
    const uploadedDocs = [];
    for (const file of req.files) {
      const { fileName, fileUrl } = await fileStorageService.uploadResume(
        file.buffer,
        file.originalname,
        userId.toString()
      );
      
      uploadedDocs.push({
        fileName,
        fileUrl,
        uploadedAt: new Date()
      });
    }

    // Add documents to profile
    profile.verification.documents.push(...uploadedDocs);
    profile.verification.status = 'pending';
    await profile.save();

    // Notify admins
    const admins = await User.find({ isAdmin: true });
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        type: 'profile_view',
        title: 'New Employer Verification Request',
        message: `${profile.companyInfo.name} has submitted verification documents`,
        data: {
          candidateId: profile._id
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification documents submitted successfully',
      data: {
        documents: uploadedDocs,
        status: profile.verification.status
      }
    });
  } catch (error) {
    console.error('Error submitting verification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit verification',
      message: error.message
    });
  }
};

/**
 * Get verification status
 */
exports.getVerificationStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await EmployerProfile.findOne({ user: userId })
      .select('verification')
      .populate('verification.verifiedBy', 'displayName');

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Employer profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile.verification
    });
  } catch (error) {
    console.error('Error fetching verification status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch verification status',
      message: error.message
    });
  }
};
