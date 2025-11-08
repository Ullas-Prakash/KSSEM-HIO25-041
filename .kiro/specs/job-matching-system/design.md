# Job Matching System - Design Document

## Overview

The Job Matching System extends the existing ConnectHer platform by adding employment opportunities for women seeking financial independence. The system enables bidirectional discovery between candidates and employers through intelligent matching based on skills, education, and location. The design integrates seamlessly with the existing Express/MongoDB/Firebase architecture while adding new models, controllers, and services for job-related functionality.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Candidate  │  │   Employer   │  │    Admin     │      │
│  │  Dashboard   │  │  Dashboard   │  │    Panel     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   API Gateway  │
                    │   (Express)    │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│  Auth Service  │  │ Job Service │  │ Match Service   │
│   (Firebase)   │  │             │  │  (Algorithm)    │
└───────┬────────┘  └──────┬──────┘  └────────┬────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                    ┌───────▼────────┐
                    │    MongoDB     │
                    │   (Mongoose)   │
                    └────────────────┘
                            │
                    ┌───────▼────────┐
                    │ Firebase/S3    │
                    │ (Resume Files) │
                    └────────────────┘
```

### Technology Stack Integration

**Existing Stack:**
- Backend: Node.js + Express.js
- Database: MongoDB Atlas with Mongoose
- Authentication: Firebase Authentication + Firebase Admin SDK
- Frontend: React 18 + Tailwind CSS

**New Additions:**
- File Storage: Firebase Storage (for resume uploads)
- Matching Engine: Custom algorithm service
- Notification Queue: In-memory queue (can be upgraded to Redis/Bull later)

## Components and Interfaces

### 1. Database Models

#### CandidateProfile Model
```javascript
{
  user: ObjectId (ref: User),
  personalInfo: {
    fullName: String,
    age: Number,
    phone: String,
    location: {
      city: String,
      state: String,
      country: String
    }
  },
  professionalInfo: {
    skills: [String],
    education: {
      level: String, // enum: ['10th', '12th', 'Diploma', 'Graduate', 'Post-Graduate']
      field: String,
      institution: String
    },
    experience: {
      years: Number,
      description: String
    },
    resume: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    }
  },
  preferences: {
    jobTypes: [String], // enum: ['Full-Time', 'Part-Time', 'Freelance', 'Remote', 'Contract']
    preferredLocations: [String],
    expectedSalary: {
      min: Number,
      max: Number,
      currency: String
    }
  },
  isProfileComplete: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### EmployerProfile Model
```javascript
{
  user: ObjectId (ref: User),
  companyInfo: {
    name: String,
    registrationNumber: String,
    description: String,
    industry: String,
    size: String, // enum: ['1-10', '11-50', '51-200', '201-500', '500+']
    website: String,
    logo: String
  },
  contactInfo: {
    phone: String,
    email: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  verification: {
    status: String, // enum: ['pending', 'verified', 'rejected']
    documents: [{
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    }],
    verifiedAt: Date,
    verifiedBy: ObjectId (ref: User),
    rejectionReason: String
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### JobPosting Model
```javascript
{
  employer: ObjectId (ref: EmployerProfile),
  jobDetails: {
    title: String,
    description: String,
    responsibilities: [String],
    requirements: {
      skills: [String],
      education: String, // enum: ['10th', '12th', 'Diploma', 'Graduate', 'Post-Graduate', 'Any']
      experience: {
        min: Number,
        max: Number
      }
    }
  },
  jobInfo: {
    type: String, // enum: ['Full-Time', 'Part-Time', 'Freelance', 'Remote', 'Contract']
    location: {
      city: String,
      state: String,
      country: String,
      isRemote: Boolean
    },
    salary: {
      min: Number,
      max: Number,
      currency: String,
      isNegotiable: Boolean
    }
  },
  status: String, // enum: ['draft', 'active', 'closed', 'inactive']
  applicationCount: Number,
  viewCount: Number,
  postedAt: Date,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Application Model
```javascript
{
  candidate: ObjectId (ref: CandidateProfile),
  job: ObjectId (ref: JobPosting),
  coverLetter: String,
  status: String, // enum: ['pending', 'shortlisted', 'rejected', 'interview_scheduled', 'hired']
  matchScore: Number,
  appliedAt: Date,
  statusHistory: [{
    status: String,
    changedAt: Date,
    changedBy: ObjectId (ref: User),
    notes: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Invitation Model
```javascript
{
  employer: ObjectId (ref: EmployerProfile),
  candidate: ObjectId (ref: CandidateProfile),
  job: ObjectId (ref: JobPosting),
  message: String,
  status: String, // enum: ['pending', 'accepted', 'declined', 'expired']
  matchScore: Number,
  sentAt: Date,
  respondedAt: Date,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Notification Model
```javascript
{
  recipient: ObjectId (ref: User),
  type: String, // enum: ['application_received', 'invitation_received', 'application_status_update', 'invitation_response', 'profile_view']
  title: String,
  message: String,
  data: {
    applicationId: ObjectId,
    invitationId: ObjectId,
    jobId: ObjectId,
    candidateId: ObjectId
  },
  isRead: Boolean,
  readAt: Date,
  createdAt: Date
}
```

### 2. API Endpoints

#### Candidate Profile Routes (`/api/candidates`)
```
POST   /api/candidates/profile          - Create/Update candidate profile
GET    /api/candidates/profile          - Get own profile
GET    /api/candidates/profile/:id      - Get candidate profile (employer view)
POST   /api/candidates/resume           - Upload resume
GET    /api/candidates/resume           - Download own resume
DELETE /api/candidates/resume           - Delete resume
GET    /api/candidates/matches          - Get matched jobs
GET    /api/candidates/applications     - Get own applications
GET    /api/candidates/invitations      - Get received invitations
```

#### Employer Profile Routes (`/api/employers`)
```
POST   /api/employers/profile           - Create/Update employer profile
GET    /api/employers/profile           - Get own profile
POST   /api/employers/verify            - Submit verification documents
GET    /api/employers/verification      - Get verification status
```

#### Job Posting Routes (`/api/jobs`)
```
POST   /api/jobs                        - Create job posting
GET    /api/jobs                        - Search jobs (public)
GET    /api/jobs/:id                    - Get job details
PUT    /api/jobs/:id                    - Update job posting
DELETE /api/jobs/:id                    - Close/Delete job posting
GET    /api/jobs/:id/matches            - Get matched candidates for job
GET    /api/jobs/:id/applications       - Get applications for job
POST   /api/jobs/:id/invite             - Send invitation to candidate
```

#### Application Routes (`/api/applications`)
```
POST   /api/applications                - Apply for job
GET    /api/applications/:id            - Get application details
PUT    /api/applications/:id/status     - Update application status (employer)
DELETE /api/applications/:id            - Withdraw application (candidate)
```

#### Invitation Routes (`/api/invitations`)
```
GET    /api/invitations/:id             - Get invitation details
PUT    /api/invitations/:id/accept      - Accept invitation
PUT    /api/invitations/:id/decline     - Decline invitation
```

#### Notification Routes (`/api/notifications`)
```
GET    /api/notifications               - Get user notifications
PUT    /api/notifications/:id/read      - Mark notification as read
PUT    /api/notifications/read-all      - Mark all as read
DELETE /api/notifications/:id           - Delete notification
```

#### Admin Routes (`/api/admin/jobs`)
```
GET    /api/admin/employers/pending     - Get pending verifications
PUT    /api/admin/employers/:id/verify  - Approve employer
PUT    /api/admin/employers/:id/reject  - Reject employer
GET    /api/admin/jobs                  - Get all jobs
PUT    /api/admin/jobs/:id/deactivate   - Deactivate job
GET    /api/admin/candidates            - Get all candidates
PUT    /api/admin/candidates/:id/suspend - Suspend candidate
GET    /api/admin/stats/jobs            - Get job platform statistics
```

### 3. Services

#### MatchingService
```javascript
class MatchingService {
  /**
   * Calculate match score between candidate and job
   * @param {Object} candidate - Candidate profile
   * @param {Object} job - Job posting
   * @returns {Number} Match score (0-100)
   */
  calculateMatchScore(candidate, job) {
    const skillsScore = this.calculateSkillsMatch(candidate.skills, job.requirements.skills);
    const educationScore = this.calculateEducationMatch(candidate.education, job.requirements.education);
    const locationScore = this.calculateLocationMatch(candidate.location, job.location);
    
    return (skillsScore * 0.5) + (educationScore * 0.3) + (locationScore * 0.2);
  }
  
  /**
   * Find top matching jobs for candidate
   * @param {String} candidateId - Candidate profile ID
   * @param {Number} limit - Number of matches to return
   * @returns {Array} Array of job postings with match scores
   */
  async findMatchingJobs(candidateId, limit = 10) {
    // Implementation
  }
  
  /**
   * Find top matching candidates for job
   * @param {String} jobId - Job posting ID
   * @param {Number} limit - Number of matches to return
   * @returns {Array} Array of candidate profiles with match scores
   */
  async findMatchingCandidates(jobId, limit = 10) {
    // Implementation
  }
}
```

**Matching Algorithm Details:**

1. **Skills Match (50% weight)**
   - Calculate Jaccard similarity: `intersection(candidateSkills, jobSkills) / union(candidateSkills, jobSkills)`
   - Normalize to 0-100 scale
   - Bonus points for exact keyword matches

2. **Education Match (30% weight)**
   - Define education hierarchy: 10th < 12th < Diploma < Graduate < Post-Graduate
   - If candidate education >= required: 100 points
   - If candidate education < required: Calculate percentage based on hierarchy distance

3. **Location Match (20% weight)**
   - Same city: 100 points
   - Same state: 70 points
   - Same country: 40 points
   - Remote job: 100 points for all candidates

#### FileStorageService
```javascript
class FileStorageService {
  /**
   * Upload resume to Firebase Storage
   * @param {Buffer} fileBuffer - File buffer
   * @param {String} fileName - Original file name
   * @param {String} userId - User ID for folder organization
   * @returns {Object} { fileName, fileUrl }
   */
  async uploadResume(fileBuffer, fileName, userId) {
    // Implementation
  }
  
  /**
   * Delete resume from Firebase Storage
   * @param {String} fileUrl - File URL to delete
   * @returns {Boolean} Success status
   */
  async deleteResume(fileUrl) {
    // Implementation
  }
  
  /**
   * Generate signed URL for resume download
   * @param {String} fileUrl - File URL
   * @returns {String} Signed URL valid for 1 hour
   */
  async getSignedUrl(fileUrl) {
    // Implementation
  }
}
```

#### NotificationService
```javascript
class NotificationService {
  /**
   * Create in-app notification
   * @param {String} recipientId - User ID
   * @param {String} type - Notification type
   * @param {Object} data - Notification data
   * @returns {Object} Created notification
   */
  async createNotification(recipientId, type, data) {
    // Implementation
  }
  
  /**
   * Send email notification (optional enhancement)
   * @param {String} email - Recipient email
   * @param {String} template - Email template name
   * @param {Object} data - Template data
   */
  async sendEmailNotification(email, template, data) {
    // Future implementation with SendGrid
  }
}
```

### 4. Middleware

#### employerVerificationMiddleware
```javascript
/**
 * Verify employer is verified before allowing certain actions
 */
async function requireVerifiedEmployer(req, res, next) {
  const employer = await EmployerProfile.findOne({ user: req.user._id });
  
  if (!employer || employer.verification.status !== 'verified') {
    return res.status(403).json({ 
      error: 'Employer verification required' 
    });
  }
  
  req.employer = employer;
  next();
}
```

#### fileUploadMiddleware
```javascript
/**
 * Handle multipart file uploads with validation
 */
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  }
});
```

## Data Models

### User Model Extension

Extend the existing User model to include role information:

```javascript
// Add to existing User schema
role: {
  type: String,
  enum: ['candidate', 'employer', 'admin', 'user'],
  default: 'user'
}
```

### Database Indexes

```javascript
// CandidateProfile indexes
CandidateProfile.index({ user: 1 });
CandidateProfile.index({ 'professionalInfo.skills': 1 });
CandidateProfile.index({ 'professionalInfo.education.level': 1 });
CandidateProfile.index({ 'preferences.preferredLocations': 1 });
CandidateProfile.index({ isActive: 1, isProfileComplete: 1 });

// EmployerProfile indexes
EmployerProfile.index({ user: 1 });
EmployerProfile.index({ 'verification.status': 1 });
EmployerProfile.index({ isActive: 1 });

// JobPosting indexes
JobPosting.index({ employer: 1 });
JobPosting.index({ status: 1, postedAt: -1 });
JobPosting.index({ 'jobDetails.requirements.skills': 1 });
JobPosting.index({ 'jobInfo.location.city': 1 });
JobPosting.index({ 'jobInfo.type': 1 });

// Application indexes
Application.index({ candidate: 1, job: 1 }, { unique: true });
Application.index({ job: 1, status: 1 });
Application.index({ candidate: 1, appliedAt: -1 });

// Invitation indexes
Invitation.index({ candidate: 1, job: 1 });
Invitation.index({ employer: 1, sentAt: -1 });
Invitation.index({ candidate: 1, status: 1 });

// Notification indexes
Notification.index({ recipient: 1, isRead: 1, createdAt: -1 });
Notification.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL
```

## Error Handling

### Error Types

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
    this.status = 403;
  }
}

class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}
```

### Error Handling Strategy

1. **Validation Errors**: Return 400 with detailed field-level errors
2. **Authentication Errors**: Return 401 with clear message
3. **Authorization Errors**: Return 403 when user lacks permissions
4. **Not Found Errors**: Return 404 for missing resources
5. **Server Errors**: Return 500 with generic message (log details internally)

## Testing Strategy

### Unit Tests

1. **Model Tests**
   - Schema validation
   - Virtual properties
   - Instance methods
   - Static methods

2. **Service Tests**
   - MatchingService algorithm accuracy
   - FileStorageService upload/download
   - NotificationService creation

3. **Utility Tests**
   - Validation functions
   - Helper functions

### Integration Tests

1. **API Endpoint Tests**
   - Authentication flow
   - CRUD operations for all resources
   - Search and filter functionality
   - File upload/download
   - Matching algorithm integration

2. **Database Tests**
   - Model relationships
   - Index performance
   - Query optimization

### End-to-End Tests

1. **User Flows**
   - Candidate registration → profile creation → job search → application
   - Employer registration → verification → job posting → candidate search → invitation
   - Admin moderation workflows

2. **Matching Flow**
   - Create candidate profile → verify matches appear
   - Create job posting → verify matches appear
   - Apply filters → verify results accuracy

### Performance Tests

1. **Load Testing**
   - Concurrent user registrations
   - Simultaneous job searches
   - Matching algorithm performance with large datasets

2. **Database Performance**
   - Query execution time
   - Index effectiveness
   - Connection pool management

## Security Considerations

### Authentication & Authorization

1. **Firebase Token Verification**: All protected routes verify Firebase ID tokens
2. **Role-Based Access Control**: Separate permissions for candidates, employers, and admins
3. **Resource Ownership**: Users can only modify their own resources
4. **Employer Verification**: Restrict sensitive actions to verified employers only

### Data Protection

1. **Resume Security**: 
   - Store in Firebase Storage with private access
   - Generate signed URLs with expiration
   - Only share with employers after application/invitation

2. **Personal Information**:
   - Hide candidate contact info until application accepted
   - Mask email addresses in search results
   - Implement data access logging

3. **Input Validation**:
   - Sanitize all user inputs
   - Validate file uploads (type, size, content)
   - Use Joi schemas for request validation

### Rate Limiting

```javascript
// Apply rate limiting to prevent abuse
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10 // limit resume uploads to 10 per hour
});
```

## Deployment Considerations

### Environment Variables

```env
# Existing
MONGODB_URI=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
NODE_ENV=

# New additions
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
MAX_RESUME_SIZE_MB=5
MATCH_ALGORITHM_VERSION=1.0
NOTIFICATION_RETENTION_DAYS=30
```

### Database Migration

Since this is adding new features to existing platform:

1. No changes to existing User, Story, Business models
2. Add new collections: CandidateProfile, EmployerProfile, JobPosting, Application, Invitation, Notification
3. Add role field to User model (default to 'user' for existing users)
4. Create indexes after initial deployment

### Scalability

1. **Matching Algorithm**: 
   - Run as background job for large datasets
   - Cache match results with TTL
   - Consider moving to separate microservice if needed

2. **File Storage**:
   - Use Firebase Storage CDN for fast delivery
   - Implement cleanup job for orphaned files

3. **Notifications**:
   - Implement TTL for old notifications
   - Consider message queue (Bull/Redis) for high volume

## Future Enhancements

1. **Email Notifications**: Integrate SendGrid for email alerts
2. **Real-time Chat**: Add Socket.IO for candidate-employer messaging
3. **Video Interviews**: Integrate video calling API
4. **AI Resume Parsing**: Auto-extract skills from resume PDFs
5. **Advanced Analytics**: Employer dashboard with hiring metrics
6. **Mobile App**: React Native app for candidates
7. **Payment Integration**: Premium job postings for employers
8. **Skill Assessments**: Built-in tests to verify candidate skills
