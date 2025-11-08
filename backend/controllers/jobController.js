const JobPosting = require('../models/JobPosting');
const EmployerProfile = require('../models/EmployerProfile');
const CandidateProfile = require('../models/CandidateProfile');
const Application = require('../models/Application');
const Invitation = require('../models/Invitation');
const Notification = require('../models/Notification');
const matchingService = require('../services/matchingService');

/**
 * Create job posting
 */
exports.createJob = async (req, res) => {
  try {
    const employer = req.employer; // From requireVerifiedEmployer middleware
    const jobData = req.body;

    const job = new JobPosting({
      employer: employer._id,
      ...jobData,
      status: 'active',
      postedAt: new Date()
    });

    await job.save();
    await job.populate('employer', 'companyInfo.name companyInfo.logo');

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create job',
      message: error.message
    });
  }
};

/**
 * Search jobs (public)
 */
exports.searchJobs = async (req, res) => {
  try {
    const {
      keywords,
      location,
      jobType,
      minSalary,
      maxSalary,
      education,
      page = 1,
      limit = 20
    } = req.query;

    const query = { status: 'active' };

    // Keyword search in title and description
    if (keywords) {
      query.$or = [
        { 'jobDetails.title': { $regex: keywords, $options: 'i' } },
        { 'jobDetails.description': { $regex: keywords, $options: 'i' } },
        { 'jobDetails.requirements.skills': { $regex: keywords, $options: 'i' } }
      ];
    }

    // Location filter
    if (location) {
      query.$or = [
        { 'jobInfo.location.city': { $regex: location, $options: 'i' } },
        { 'jobInfo.location.state': { $regex: location, $options: 'i' } },
        { 'jobInfo.location.isRemote': true }
      ];
    }

    // Job type filter
    if (jobType) {
      query['jobInfo.type'] = jobType;
    }

    // Salary filter
    if (minSalary || maxSalary) {
      query['jobInfo.salary.min'] = {};
      if (minSalary) query['jobInfo.salary.min'].$gte = parseInt(minSalary);
      if (maxSalary) query['jobInfo.salary.max'] = { $lte: parseInt(maxSalary) };
    }

    // Education filter
    if (education) {
      query['jobDetails.requirements.education'] = education;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await JobPosting.find(query)
      .populate('employer', 'companyInfo.name companyInfo.logo companyInfo.industry')
      .sort({ postedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await JobPosting.countDocuments(query);

    res.status(200).json({
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
    console.error('Error searching jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search jobs',
      message: error.message
    });
  }
};

/**
 * Get job details
 */
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await JobPosting.findById(id)
      .populate('employer', 'companyInfo contactInfo.email contactInfo.phone');

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Increment view count
    await job.incrementViewCount();

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch job',
      message: error.message
    });
  }
};

/**
 * Update job posting
 */
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const employer = req.employer;
    const updateData = req.body;

    const job = await JobPosting.findOne({ _id: id, employer: employer._id });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found or unauthorized'
      });
    }

    Object.assign(job, updateData);
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update job',
      message: error.message
    });
  }
};

/**
 * Close/Delete job posting
 */
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const employer = req.employer;

    const job = await JobPosting.findOne({ _id: id, employer: employer._id });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found or unauthorized'
      });
    }

    job.status = 'closed';
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job closed successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to close job',
      message: error.message
    });
  }
};

/**
 * Get matched candidates for job
 */
exports.getMatchedCandidates = async (req, res) => {
  try {
    const { id } = req.params;
    const employer = req.employer;
    const limit = parseInt(req.query.limit) || 10;

    const job = await JobPosting.findOne({ _id: id, employer: employer._id });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found or unauthorized'
      });
    }

    const matches = await matchingService.findMatchingCandidates(id, limit);

    res.status(200).json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error('Error getting matched candidates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get matched candidates',
      message: error.message
    });
  }
};

/**
 * Get applications for job
 */
exports.getJobApplications = async (req, res) => {
  try {
    const { id } = req.params;
    const employer = req.employer;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const job = await JobPosting.findOne({ _id: id, employer: employer._id });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found or unauthorized'
      });
    }

    const applications = await Application.find({ job: id })
      .populate({
        path: 'candidate',
        populate: {
          path: 'user',
          select: 'displayName email photoURL'
        }
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments({ job: id });

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
    console.error('Error getting job applications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get applications',
      message: error.message
    });
  }
};

/**
 * Send invitation to candidate
 */
exports.inviteCandidate = async (req, res) => {
  try {
    const { id } = req.params; // job id
    const employer = req.employer;
    const { candidateId, message } = req.body;

    // Verify job belongs to employer
    const job = await JobPosting.findOne({ _id: id, employer: employer._id });
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found or unauthorized'
      });
    }

    // Verify candidate exists
    const candidate = await CandidateProfile.findById(candidateId).populate('user');
    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found'
      });
    }

    // Check if invitation already exists
    const existingInvitation = await Invitation.findOne({
      employer: employer._id,
      candidate: candidateId,
      job: id,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingInvitation) {
      return res.status(400).json({
        success: false,
        error: 'Invitation already sent to this candidate'
      });
    }

    // Calculate match score
    const matchScore = matchingService.calculateMatchScore(candidate, job);

    // Create invitation
    const invitation = new Invitation({
      employer: employer._id,
      candidate: candidateId,
      job: id,
      message,
      matchScore
    });

    await invitation.save();

    // Create notification for candidate
    await Notification.create({
      recipient: candidate.user._id,
      type: 'invitation_received',
      title: 'New Job Invitation',
      message: `You have received an invitation for ${job.jobDetails.title}`,
      data: {
        invitationId: invitation._id,
        jobId: job._id
      }
    });

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
      data: invitation
    });
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send invitation',
      message: error.message
    });
  }
};

/**
 * Get employer's own job postings
 */
exports.getEmployerJobs = async (req, res) => {
  try {
    const employer = req.employer;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const jobs = await JobPosting.find({ employer: employer._id })
      .sort({ postedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await JobPosting.countDocuments({ employer: employer._id });

    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting employer jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get jobs',
      message: error.message
    });
  }
};
