const EmployerProfile = require('../models/EmployerProfile');

/**
 * Middleware to check if employer is verified
 */
const requireVerifiedEmployer = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const employer = await EmployerProfile.findOne({ user: userId });

    if (!employer) {
      return res.status(403).json({
        success: false,
        error: 'Employer profile not found'
      });
    }

    if (employer.verification.status !== 'verified') {
      return res.status(403).json({
        success: false,
        error: 'Employer verification required',
        message: 'Your employer account must be verified to perform this action'
      });
    }

    // Attach employer profile to request
    req.employer = employer;
    next();
  } catch (error) {
    console.error('Error in employer verification middleware:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify employer status',
      message: error.message
    });
  }
};

module.exports = requireVerifiedEmployer;
