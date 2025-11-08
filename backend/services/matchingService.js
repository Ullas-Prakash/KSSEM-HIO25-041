const CandidateProfile = require('../models/CandidateProfile');
const JobPosting = require('../models/JobPosting');

class MatchingService {
  /**
   * Calculate match score between candidate and job
   * @param {Object} candidate - Candidate profile
   * @param {Object} job - Job posting
   * @returns {Number} Match score (0-100)
   */
  calculateMatchScore(candidate, job) {
    const skillsScore = this.calculateSkillsMatch(
      candidate.professionalInfo.skills,
      job.jobDetails.requirements.skills
    );
    
    const educationScore = this.calculateEducationMatch(
      candidate.professionalInfo.education.level,
      job.jobDetails.requirements.education
    );
    
    const locationScore = this.calculateLocationMatch(
      candidate.personalInfo.location,
      job.jobInfo.location
    );
    
    // Weighted average: Skills 50%, Education 30%, Location 20%
    const finalScore = (skillsScore * 0.5) + (educationScore * 0.3) + (locationScore * 0.2);
    
    return Math.round(finalScore);
  }

  /**
   * Calculate skills match using Jaccard similarity
   * @param {Array} candidateSkills - Candidate's skills
   * @param {Array} jobSkills - Job's required skills
   * @returns {Number} Skills match score (0-100)
   */
  calculateSkillsMatch(candidateSkills, jobSkills) {
    if (!candidateSkills || candidateSkills.length === 0) return 0;
    if (!jobSkills || jobSkills.length === 0) return 100; // No specific skills required
    
    // Normalize skills to lowercase for comparison
    const normalizedCandidateSkills = candidateSkills.map(s => s.toLowerCase().trim());
    const normalizedJobSkills = jobSkills.map(s => s.toLowerCase().trim());
    
    // Calculate intersection
    const intersection = normalizedCandidateSkills.filter(skill => 
      normalizedJobSkills.includes(skill)
    );
    
    // Calculate union
    const union = new Set([...normalizedCandidateSkills, ...normalizedJobSkills]);
    
    // Jaccard similarity
    const jaccardSimilarity = intersection.length / union.size;
    
    // Convert to 0-100 scale
    return Math.round(jaccardSimilarity * 100);
  }

  /**
   * Calculate education match based on hierarchy
   * @param {String} candidateEducation - Candidate's education level
   * @param {String} requiredEducation - Job's required education level
   * @returns {Number} Education match score (0-100)
   */
  calculateEducationMatch(candidateEducation, requiredEducation) {
    if (!requiredEducation || requiredEducation === 'Any') return 100;
    if (!candidateEducation) return 0;
    
    // Education hierarchy
    const educationHierarchy = {
      '10th': 1,
      '12th': 2,
      'Diploma': 3,
      'Graduate': 4,
      'Post-Graduate': 5
    };
    
    const candidateLevel = educationHierarchy[candidateEducation] || 0;
    const requiredLevel = educationHierarchy[requiredEducation] || 0;
    
    // If candidate meets or exceeds requirement
    if (candidateLevel >= requiredLevel) {
      return 100;
    }
    
    // Calculate percentage based on hierarchy distance
    const distance = requiredLevel - candidateLevel;
    const maxDistance = 4; // Maximum distance in hierarchy
    const score = Math.max(0, 100 - (distance / maxDistance * 100));
    
    return Math.round(score);
  }

  /**
   * Calculate location match based on proximity
   * @param {Object} candidateLocation - Candidate's location
   * @param {Object} jobLocation - Job's location
   * @returns {Number} Location match score (0-100)
   */
  calculateLocationMatch(candidateLocation, jobLocation) {
    // Remote jobs match everyone
    if (jobLocation.isRemote) return 100;
    
    if (!candidateLocation || !jobLocation) return 50; // Neutral score if location not specified
    
    // Same city - perfect match
    if (candidateLocation.city && jobLocation.city &&
        candidateLocation.city.toLowerCase() === jobLocation.city.toLowerCase()) {
      return 100;
    }
    
    // Same state - good match
    if (candidateLocation.state && jobLocation.state &&
        candidateLocation.state.toLowerCase() === jobLocation.state.toLowerCase()) {
      return 70;
    }
    
    // Same country - acceptable match
    if (candidateLocation.country && jobLocation.country &&
        candidateLocation.country.toLowerCase() === jobLocation.country.toLowerCase()) {
      return 40;
    }
    
    // Different country - poor match
    return 10;
  }

  /**
   * Find top matching jobs for candidate
   * @param {String} candidateId - Candidate profile ID
   * @param {Number} limit - Number of matches to return
   * @returns {Array} Array of job postings with match scores
   */
  async findMatchingJobs(candidateId, limit = 10) {
    try {
      // Get candidate profile
      const candidate = await CandidateProfile.findById(candidateId);
      if (!candidate) {
        throw new Error('Candidate profile not found');
      }
      
      // Get all active job postings
      const jobs = await JobPosting.find({ status: 'active' })
        .populate('employer', 'companyInfo.name')
        .lean();
      
      // Calculate match scores
      const jobsWithScores = jobs.map(job => ({
        ...job,
        matchScore: this.calculateMatchScore(candidate, job)
      }));
      
      // Sort by match score descending
      jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
      
      // Return top N matches
      return jobsWithScores.slice(0, limit);
    } catch (error) {
      console.error('Error finding matching jobs:', error);
      throw error;
    }
  }

  /**
   * Find top matching candidates for job
   * @param {String} jobId - Job posting ID
   * @param {Number} limit - Number of matches to return
   * @returns {Array} Array of candidate profiles with match scores
   */
  async findMatchingCandidates(jobId, limit = 10) {
    try {
      // Get job posting
      const job = await JobPosting.findById(jobId);
      if (!job) {
        throw new Error('Job posting not found');
      }
      
      // Get all active and complete candidate profiles
      const candidates = await CandidateProfile.find({ 
        isActive: true,
        isProfileComplete: true
      })
        .populate('user', 'displayName email')
        .lean();
      
      // Calculate match scores
      const candidatesWithScores = candidates.map(candidate => ({
        ...candidate,
        matchScore: this.calculateMatchScore(candidate, job)
      }));
      
      // Sort by match score descending
      candidatesWithScores.sort((a, b) => b.matchScore - a.matchScore);
      
      // Return top N matches
      return candidatesWithScores.slice(0, limit);
    } catch (error) {
      console.error('Error finding matching candidates:', error);
      throw error;
    }
  }
}

module.exports = new MatchingService();
