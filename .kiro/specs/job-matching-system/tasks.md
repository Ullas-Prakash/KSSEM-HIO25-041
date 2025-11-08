# Implementation Plan

- [x] 1. Set up database models and schemas

  - Create all 6 new Mongoose models with proper schemas, validation, and indexes
  - Extend existing User model to include role field
  - _Requirements: 1.1, 2.1, 3.1, 7.1, 8.1, 9.1_

- [x] 1.1 Create CandidateProfile model



  - Write Mongoose schema with personalInfo, professionalInfo, and preferences sections
  - Add validation for required fields and enums
  - Create indexes for user, skills, education, and location fields


  - _Requirements: 1.1, 1.4_

- [ ] 1.2 Create EmployerProfile model
  - Write Mongoose schema with companyInfo, contactInfo, and verification sections


  - Add validation for company registration and contact details
  - Create indexes for user and verification status
  - _Requirements: 2.1, 2.2_



- [ ] 1.3 Create JobPosting model
  - Write Mongoose schema with jobDetails, jobInfo, and status fields
  - Add validation for required skills, education, and salary ranges
  - Create indexes for employer, status, skills, and location


  - _Requirements: 3.1, 3.2_

- [ ] 1.4 Create Application model
  - Write Mongoose schema linking candidate and job with status tracking


  - Add unique compound index on candidate and job
  - Include statusHistory array for tracking changes
  - _Requirements: 7.1, 7.4_



- [ ] 1.5 Create Invitation model
  - Write Mongoose schema linking employer, candidate, and job
  - Add status field with pending/accepted/declined/expired enum

  - Include expiration logic and timestamps
  - _Requirements: 8.1, 8.4_

- [ ] 1.6 Create Notification model
  - Write Mongoose schema with recipient, type, message, and data fields
  - Add TTL index for automatic cleanup after 30 days


  - Create index for recipient and read status
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 1.7 Extend User model with role field


  - Add role field to existing User schema with enum values
  - Set default value to 'user' for backward compatibility
  - Create migration script to update existing users if needed
  - _Requirements: 1.1, 2.1_


- [ ] 2. Implement file storage service
  - Create FileStorageService class for Firebase Storage integration
  - Implement resume upload, download, and delete methods
  - Add file validation for PDF/DOCX formats and 5MB size limit
  - _Requirements: 1.2, 1.3_


- [ ] 2.1 Set up Firebase Storage configuration
  - Configure Firebase Storage bucket in backend config
  - Add environment variables for storage bucket name

  - Initialize Firebase Storage in the application
  - _Requirements: 1.2_

- [ ] 2.2 Implement resume upload functionality
  - Create uploadResume method with file validation
  - Generate unique file names with user ID prefix
  - Store file metadata in database


  - Return file URL and metadata
  - _Requirements: 1.2, 1.3_

- [ ] 2.3 Implement resume download with signed URLs
  - Create getSignedUrl method for secure file access

  - Set expiration time to 1 hour for signed URLs
  - Verify user authorization before generating URL
  - _Requirements: 1.5_

- [ ] 2.4 Implement resume deletion
  - Create deleteResume method to remove file from storage

  - Update database to remove file metadata
  - Handle orphaned file cleanup
  - _Requirements: 1.3_

- [ ] 3. Build matching algorithm service
  - Create MatchingService class with score calculation methods

  - Implement skills matching using Jaccard similarity
  - Implement education hierarchy matching
  - Implement location proximity matching
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 3.1 Implement skills matching algorithm

  - Calculate intersection and union of skill arrays
  - Compute Jaccard similarity coefficient
  - Normalize score to 0-100 scale
  - Apply 50% weight to final match score
  - _Requirements: 6.3_


- [ ] 3.2 Implement education matching algorithm
  - Define education level hierarchy mapping
  - Compare candidate education with job requirements
  - Calculate compatibility score based on hierarchy
  - Apply 30% weight to final match score
  - _Requirements: 6.3_



- [ ] 3.3 Implement location matching algorithm
  - Compare city, state, and country fields
  - Assign scores: same city (100), same state (70), same country (40)
  - Handle remote jobs with 100 score for all candidates

  - Apply 20% weight to final match score
  - _Requirements: 6.3_

- [ ] 3.4 Implement findMatchingJobs method
  - Query active job postings from database

  - Calculate match score for each job
  - Sort by match score descending
  - Return top N matches with scores
  - _Requirements: 6.2, 6.4_

- [x] 3.5 Implement findMatchingCandidates method

  - Query active candidate profiles from database
  - Calculate match score for each candidate
  - Sort by match score descending
  - Return top N matches with scores
  - _Requirements: 6.1, 6.5_


- [ ] 4. Create candidate profile API endpoints
  - Implement routes for profile CRUD operations
  - Add resume upload/download endpoints
  - Create endpoints for viewing matches and applications

  - Add middleware for authentication and authorization
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.4, 7.3_

- [ ] 4.1 Implement POST /api/candidates/profile
  - Create controller to handle profile creation/update

  - Validate input data using Joi schema
  - Check if profile exists and update or create new
  - Set isProfileComplete flag based on required fields
  - _Requirements: 1.1, 1.4_

- [x] 4.2 Implement GET /api/candidates/profile

  - Create controller to fetch authenticated user's profile
  - Populate user reference data
  - Return complete profile with all sections
  - _Requirements: 1.5_


- [ ] 4.3 Implement POST /api/candidates/resume
  - Add multer middleware for file upload handling
  - Validate file type (PDF/DOCX) and size (5MB max)
  - Call FileStorageService to upload file
  - Update candidate profile with file metadata
  - _Requirements: 1.2, 1.3_



- [ ] 4.4 Implement GET /api/candidates/resume
  - Verify user owns the resume
  - Generate signed URL using FileStorageService

  - Return download URL with expiration
  - _Requirements: 1.5_

- [ ] 4.5 Implement DELETE /api/candidates/resume
  - Verify user owns the resume

  - Call FileStorageService to delete file
  - Remove file metadata from profile
  - _Requirements: 1.3_

- [ ] 4.6 Implement GET /api/candidates/matches
  - Get authenticated candidate's profile

  - Call MatchingService.findMatchingJobs
  - Return top 10 matched jobs with scores
  - _Requirements: 6.4_

- [x] 4.7 Implement GET /api/candidates/applications

  - Query applications for authenticated candidate
  - Populate job and employer details
  - Sort by application date descending
  - Implement pagination
  - _Requirements: 7.3_



- [ ] 4.8 Implement GET /api/candidates/invitations
  - Query invitations for authenticated candidate
  - Populate job and employer details
  - Filter by status if provided
  - Sort by sent date descending
  - _Requirements: 8.3_



- [ ] 5. Create employer profile API endpoints
  - Implement routes for employer profile management
  - Add verification submission endpoint
  - Create middleware to check verification status

  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 5.1 Implement POST /api/employers/profile
  - Create controller to handle employer profile creation/update
  - Validate company information and contact details
  - Set verification status to pending for new profiles
  - _Requirements: 2.1_

- [ ] 5.2 Implement GET /api/employers/profile
  - Create controller to fetch authenticated employer's profile
  - Populate user reference data
  - Return complete profile including verification status
  - _Requirements: 2.1_

- [ ] 5.3 Implement POST /api/employers/verify
  - Add file upload middleware for verification documents
  - Store documents using FileStorageService
  - Update employer profile with document URLs
  - Send notification to admins for review
  - _Requirements: 2.2_

- [ ] 5.4 Implement GET /api/employers/verification
  - Return current verification status
  - Include rejection reason if status is rejected
  - Show verification date if verified
  - _Requirements: 2.3_

- [ ] 5.5 Create requireVerifiedEmployer middleware
  - Check if user has employer profile
  - Verify employer verification status is 'verified'
  - Return 403 error if not verified
  - Attach employer profile to request object
  - _Requirements: 2.4_

- [ ] 6. Create job posting API endpoints
  - Implement CRUD operations for job postings
  - Add search and filter functionality
  - Create endpoints for viewing matches and applications
  - Add invitation sending endpoint
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 6.5, 8.1_

- [ ] 6.1 Implement POST /api/jobs
  - Create controller for job posting creation
  - Validate job details and requirements using Joi
  - Verify employer is verified using middleware
  - Set status to active and initialize counters
  - _Requirements: 3.1, 3.2_

- [ ] 6.2 Implement GET /api/jobs (search)
  - Create controller with query parameter support
  - Filter by keywords, 