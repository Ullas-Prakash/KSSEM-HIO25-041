const Invitation = require('../models/Invitation');
const Application = require('../models/Application');
const CandidateProfile = require('../models/CandidateProfile');
const EmployerProfile = require('../models/EmployerProfile');
const Notification = require('../models/Notification');

/**
 * Get invitation details
 */
exports.getInvitationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const invitation = await Invitation.findById(id)
      .populate({
        path: 'job',
        populate: {
          path: 'employer',
          select: 'companyInfo'
        }
      })
      .populate('candidate', 'personalInfo professionalInfo')
      .populate('employer', 'companyInfo');

    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: 'Invitation not found'
      });
    }

    // Check authorization
    const candidate = await CandidateProfile.findOne({ user: userId });
    const employer = await EmployerProfile.findOne({ user: userId });

    const isCandidate = candidate && invitation.candidate._id.equals(candidate._id);
    const isEmployer = employer && invitation.employer.equals(employer._id);

    if (!isCandidate && !isEmployer) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to view this invitation'
      });
    }

    res.status(200).json({
      success: true,
      data: invitation
    });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch invitation',
      message: error.message
    });
  }
};

/**
 * Accept invitation
 */
exports.acceptInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const invitation = await Invitation.findById(id)
      .populate('job')
      .populate('employer');

    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: 'Invitation not found'
      });
    }

    // Verify candidate owns the invitation
    const candidate = await CandidateProfile.findOne({ user: userId });
    if (!candidate || !invitation.candidate.equals(candidate._id)) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to accept this invitation'
      });
    }

    // Check if invitation is still valid
    if (invitation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: `Invitation is already ${invitation.status}`
      });
    }

    if (invitation.isExpired()) {
      invitation.status = 'expired';
      await invitation.save();
      return res.status(400).json({
        success: false,
        error: 'Invitation has expired'
      });
    }

    // Accept invitation
    await invitation.accept();

    // Create application automatically
    const existingApplication = await Application.findOne({
      candidate: candidate._id,
      job: invitation.job._id
    });

    if (!existingApplication) {
      const application = new Application({
        candidate: candidate._id,
        job: invitation.job._id,
        matchScore: invitation.matchScore,
        statusHistory: [{
          status: 'pending',
          changedAt: new Date(),
          notes: 'Created from accepted invitation'
        }]
      });
      await application.save();

      // Increment job application count
      await invitation.job.incrementApplicationCount();
    }

    // Notify employer
    const employer = await EmployerProfile.findById(invitation.employer);
    await Notification.create({
      recipient: employer.user,
      type: 'invitation_response',
      title: 'Invitation Accepted',
      message: `${candidate.personalInfo.fullName} accepted your invitation for ${invitation.job.jobDetails.title}`,
      data: {
        invitationId: invitation._id,
        jobId: invitation.job._id,
        candidateId: candidate._id
      }
    });

    res.status(200).json({
      success: true,
      message: 'Invitation accepted successfully',
      data: invitation
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to accept invitation',
      message: error.message
    });
  }
};

/**
 * Decline invitation
 */
exports.declineInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const invitation = await Invitation.findById(id)
      .populate('job')
      .populate('employer');

    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: 'Invitation not found'
      });
    }

    // Verify candidate owns the invitation
    const candidate = await CandidateProfile.findOne({ user: userId });
    if (!candidate || !invitation.candidate.equals(candidate._id)) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to decline this invitation'
      });
    }

    // Check if invitation is still valid
    if (invitation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: `Invitation is already ${invitation.status}`
      });
    }

    // Decline invitation
    await invitation.decline();

    // Notify employer
    const employer = await EmployerProfile.findById(invitation.employer);
    await Notification.create({
      recipient: employer.user,
      type: 'invitation_response',
      title: 'Invitation Declined',
      message: `${candidate.personalInfo.fullName} declined your invitation for ${invitation.job.jobDetails.title}`,
      data: {
        invitationId: invitation._id,
        jobId: invitation.job._id
      }
    });

    res.status(200).json({
      success: true,
      message: 'Invitation declined successfully',
      data: invitation
    });
  } catch (error) {
    console.error('Error declining invitation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to decline invitation',
      message: error.message
    });
  }
};
