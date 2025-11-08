const Story = require('../models/Story');
const Business = require('../models/Business');
const User = require('../models/User');

exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate('author', 'displayName email')
      .sort({ createdAt: -1 });

    res.json({ stories });
  } catch (error) {
    console.error('Error fetching all stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    story.isActive = false;
    await story.save();

    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
};

exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate('owner', 'displayName email')
      .sort({ createdAt: -1 });

    res.json({ businesses });
  } catch (error) {
    console.error('Error fetching all businesses:', error);
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    business.isActive = false;
    await business.save();

    res.json({ success: true, message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ error: 'Failed to delete business' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStories = await Story.countDocuments({ isActive: true });
    const totalBusinesses = await Business.countDocuments({ isActive: true });

    const stories = await Story.find({ isActive: true });
    const totalLikes = stories.reduce((sum, story) => sum + story.likes.length, 0);
    const totalComments = stories.reduce((sum, story) => sum + story.comments.length, 0);

    res.json({
      totalUsers,
      totalStories,
      totalBusinesses,
      engagement: {
        totalLikes,
        totalComments,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// Job Platform Admin Functions
const EmployerProfile = require('../models/EmployerProfile');
const JobPosting = require('../models/JobPosting');
const CandidateProfile = require('../models/CandidateProfile');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

/**
 * Get pending employer verifications
 */
exports.getPendingVerifications = async (req, res) => {
  try {
    const pendingEmployers = await EmployerProfile.find({ 
      'verification.status': 'pending' 
    })
      .populate('user', 'displayName email')
      .sort({ createdAt: -1 });

    res.json({ 
      success: true,
      data: pendingEmployers 
    });
  } catch (error) {
    console.error('Error fetching pending verifications:', error);
    res.status(500).json({ error: 'Failed to fetch pending verifications' });
  }
};

/**
 * Approve employer verification
 */
exports.approveEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;

    const employer = await EmployerProfile.findById(id);

    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    employer.verification.status = 'verified';
    employer.verification.verifiedAt = new Date();
    employer.verification.verifiedBy = adminId;
    await employer.save();

    // Notify employer
    await Notification.create({
      recipient: employer.user,
      type: 'profile_view',
      title: 'Employer Verification Approved',
      message: 'Your employer account has been verified. You can now post jobs and invite candidates.',
      data: {}
    });

    res.json({ 
      success: true, 
      message: 'Employer verified successfully',
      data: employer
    });
  } catch (error) {
    console.error('Error approving employer:', error);
    res.status(500).json({ error: 'Failed to approve employer' });
  }
};

/**
 * Reject employer verification
 */
exports.rejectEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user._id;

    const employer = await EmployerProfile.findById(id);

    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    employer.verification.status = 'rejected';
    employer.verification.rejectionReason = reason;
    employer.verification.verifiedBy = adminId;
    await employer.save();

    // Notify employer
    await Notification.create({
      recipient: employer.user,
      type: 'profile_view',
      title: 'Employer Verification Rejected',
      message: `Your employer verification was rejected. Reason: ${reason}`,
      data: {}
    });

    res.json({ 
      success: true, 
      message: 'Employer verification rejected',
      data: employer
    });
  } catch (error) {
    console.error('Error rejecting employer:', error);
    res.status(500).json({ error: 'Failed to reject employer' });
  }
};

/**
 * Get all jobs
 */
exports.getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await JobPosting.find()
      .populate('employer', 'companyInfo.name')
      .sort({ postedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await JobPosting.countDocuments();

    res.json({ 
      success: true,
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

/**
 * Deactivate job
 */
exports.deactivateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await JobPosting.findById(id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    job.status = 'inactive';
    await job.save();

    res.json({ 
      success: true, 
      message: 'Job deactivated successfully' 
    });
  } catch (error) {
    console.error('Error deactivating job:', error);
    res.status(500).json({ error: 'Failed to deactivate job' });
  }
};

/**
 * Get all candidates
 */
exports.getAllCandidates = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const candidates = await CandidateProfile.find()
      .populate('user', 'displayName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await CandidateProfile.countDocuments();

    res.json({ 
      success: true,
      data: candidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching all candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
};

/**
 * Suspend candidate
 */
exports.suspendCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await CandidateProfile.findById(id);

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    candidate.isActive = false;
    await candidate.save();

    // Notify candidate
    await Notification.create({
      recipient: candidate.user,
      type: 'profile_view',
      title: 'Account Suspended',
      message: 'Your candidate account has been suspended. Please contact support for more information.',
      data: {}
    });

    res.json({ 
      success: true, 
      message: 'Candidate suspended successfully' 
    });
  } catch (error) {
    console.error('Error suspending candidate:', error);
    res.status(500).json({ error: 'Failed to suspend candidate' });
  }
};

/**
 * Get job platform statistics
 */
exports.getJobStats = async (req, res) => {
  try {
    const totalCandidates = await CandidateProfile.countDocuments({ isActive: true });
    const totalEmployers = await EmployerProfile.countDocuments({ isActive: true });
    const verifiedEmployers = await EmployerProfile.countDocuments({ 
      'verification.status': 'verified',
      isActive: true 
    });
    const pendingVerifications = await EmployerProfile.countDocuments({ 
      'verification.status': 'pending' 
    });
    const totalJobs = await JobPosting.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();

    res.json({
      success: true,
      data: {
        candidates: {
          total: totalCandidates
        },
        employers: {
          total: totalEmployers,
          verified: verifiedEmployers,
          pendingVerification: pendingVerifications
        },
        jobs: {
          active: totalJobs
        },
        applications: {
          total: totalApplications
        }
      }
    });
  } catch (error) {
    console.error('Error fetching job stats:', error);
    res.status(500).json({ error: 'Failed to fetch job statistics' });
  }
};
