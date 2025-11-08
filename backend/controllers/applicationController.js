const Application = require('../models/Application');
const CandidateProfile = require('../models/CandidateProfile');
const JobPosting = require('../models/JobPosting');
const Notification = require('../models/Notification');
const EmployerProfile = require('../models/EmployerProfile');
const matchingService = require('../services/matchingService');

/**
 * Apply for a job
 */
exports.applyForJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId, coverLetter } = req.body;

    // Get candidate profile
    const candidate = await CandidateProfile.findOne({ user: userId });
    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate profile not found. Please create a profile first'
      });
    }

    // Get job posting
    const job = await JobPosting.findById(jobId).populate('employer');
    if (!job || job.status !== 'active') {
      return res.status(404).json({
        success: false,
        error: 'Job not found or no longer active'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      candidate: candidate._id,
      job: jobId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied for this job'
      });
    }

    // Calculate match score
    const matchScore = matchingService.calculateMatchScore(candidate, job);

    // Create application
    const application = new Application({
      candidate: candidate._id,
      job: jobId,
      coverLetter,
      matchScore,
      statusHistory: [{
        status: 'pending',
        changedAt: new Date()
      }]
    });

    await application.save();

    // Increment job application count
    await job.incrementApplicationCount();

    // Notify employer
    const employer = await EmployerProfile.findById(job.employer);
    await Notification.create({
      recipient: employer.user,
      type: 'application_received',
      title: 'New Job Application',
      message: `${candidate.personalInfo.fullName} applied for ${job.jobDetails.title}`,
      data: {
        applicationId: application._id,
        jobId: job._id,
        candidateId: candidate._id
      }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit application',
      message: error.message
    });
  }
};

/**
 * Get application details
 */
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const application = await Application.findById(id)
      .populate({
        path: 'candidate',
        populate: {
          path: 'user',
          select: 'displayName email photoURL'
        }
      })
      .populate({
        path: 'job',
        populate: {
          path: 'employer',
          select: 'companyInfo'
        }
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Check authorization
    const candidate = await CandidateProfile.findOne({ user: userId });
    const employer = await EmployerProfile.findOne({ user: userId });

    const isCandidate = candidate && application.candidate._id.equals(candidate._id);
    const isEmployer = employer && application.job.employer._id.equals(employer._id);

    if (!isCandidate && !isEmployer) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch application',
      message: error.message
    });
  }
};

/**
 * Update application status (employer only)
 */
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user._id;

    const application = await Application.findById(id)
      .populate('candidate')
      .populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Verify employer owns the job
    const employer = await EmployerProfile.findOne({ user: userId });
    if (!employer || !application.job.employer.equals(employer._id)) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to update this application'
      });
    }

    // Update status with history
    await application.updateStatus(status, userId, notes);

    // Notify candidate
    await Notification.create({
      recipient: application.candidate.user,
      type: 'application_status_update',
      title: 'Application Status Updated',
      message: `Your application for ${application.job.jobDetails.title} has been ${status}`,
      data: {
        applicationId: application._id,
        jobId: application.job._id
      }
    });

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update application status',
      message: error.message
    });
  }
};

/**
 * Withdraw application (candidate only)
 */
exports.withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Verify candidate owns the application
    const candidate = await CandidateProfile.findOne({ user: userId });
    if (!candidate || !application.candidate.equals(candidate._id)) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to withdraw this application'
      });
    }

    await application.updateStatus('rejected', userId, 'Withdrawn by candidate');

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error('Error withdrawing application:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to withdraw application',
      message: error.message
    });
  }
};
