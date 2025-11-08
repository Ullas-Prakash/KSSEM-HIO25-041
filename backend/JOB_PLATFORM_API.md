# Job Platform API Documentation

## Overview

The Job Platform extends ConnectHer with employment opportunities for women seeking financial independence. It enables bidirectional discovery between candidates and employers through intelligent matching.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected routes require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

## API Endpoints

### Candidate Profile

#### Create/Update Candidate Profile
```
POST /candidates/profile
```

**Request Body:**
```json
{
  "personalInfo": {
    "fullName": "Jane Doe",
    "age": 28,
    "phone": "+91-9876543210",
    "location": {
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India"
    }
  },
  "professionalInfo": {
    "skills": ["Typing", "MS Word", "Data Entry"],
    "education": {
      "level": "12th",
      "field": "Commerce",
      "institution": "ABC School"
    },
    "experience": {
      "years": 2,
      "description": "2 years of data entry experience"
    }
  },
  "preferences": {
    "jobTypes": ["Part-Time", "Remote"],
    "preferredLocations": ["Mumbai", "Pune"],
    "expectedSalary": {
      "min": 15000,
      "max": 25000,
      "currency": "INR"
    }
  }
}
```

#### Get Own Profile
```
GET /candidates/profile
```

#### Upload Resume
```
POST /candidates/resume
Content-Type: multipart/form-data

resume: <file> (PDF or DOCX, max 5MB)
```

#### Get Resume Download URL
```
GET /candidates/resume
```

#### Delete Resume
```
DELETE /candidates/resume
```

#### Get Matched Jobs
```
GET /candidates/matches?limit=10
```

#### Get Applications
```
GET /candidates/applications?page=1&limit=20
```

#### Get Invitations
```
GET /candidates/invitations?status=pending&page=1&limit=20
```

---

### Employer Profile

#### Create/Update Employer Profile
```
POST /employers/profile
```

**Request Body:**
```json
{
  "companyInfo": {
    "name": "ABC Company",
    "registrationNumber": "REG123456",
    "description": "Leading data services company",
    "industry": "IT Services",
    "size": "11-50",
    "website": "https://example.com"
  },
  "contactInfo": {
    "phone": "+91-9876543210",
    "email": "hr@example.com",
    "address": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001",
      "country": "India"
    }
  }
}
```

#### Get Own Profile
```
GET /employers/profile
```

#### Submit Verification Documents
```
POST /employers/verify
Content-Type: multipart/form-data

documents: <files> (up to 5 files, max 5MB each)
```

#### Get Verification Status
```
GET /employers/verification
```

---

### Job Postings

#### Create Job (Verified Employers Only)
```
POST /jobs
```

**Request Body:**
```json
{
  "jobDetails": {
    "title": "Data Entry Operator",
    "description": "Looking for skilled data entry operators",
    "responsibilities": [
      "Enter data accurately",
      "Maintain records"
    ],
    "requirements": {
      "skills": ["Typing", "MS Word", "Excel"],
      "education": "12th",
      "experience": {
        "min": 0,
        "max": 2
      }
    }
  },
  "jobInfo": {
    "type": "Part-Time",
    "location": {
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "isRemote": false
    },
    "salary": {
      "min": 15000,
      "max": 20000,
      "currency": "INR",
      "isNegotiable": true
    }
  }
}
```

#### Search Jobs (Public)
```
GET /jobs?keywords=data entry&location=Mumbai&jobType=Part-Time&page=1&limit=20
```

**Query Parameters:**
- `keywords`: Search in title, description, skills
- `location`: City, state, or remote
- `jobType`: Full-Time, Part-Time, Freelance, Remote, Contract
- `minSalary`: Minimum salary
- `maxSalary`: Maximum salary
- `education`: Education level required
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)

#### Get Job Details
```
GET /jobs/:id
```

#### Update Job (Employer Only)
```
PUT /jobs/:id
```

#### Close Job (Employer Only)
```
DELETE /jobs/:id
```

#### Get Matched Candidates (Employer Only)
```
GET /jobs/:id/matches?limit=10
```

#### Get Job Applications (Employer Only)
```
GET /jobs/:id/applications?page=1&limit=20
```

#### Send Invitation to Candidate (Employer Only)
```
POST /jobs/:id/invite
```

**Request Body:**
```json
{
  "candidateId": "candidate_id_here",
  "message": "We think you'd be a great fit for this position"
}
```

#### Get Employer's Jobs
```
GET /jobs/employer/my-jobs?page=1&limit=20
```

---

### Applications

#### Apply for Job
```
POST /applications
```

**Request Body:**
```json
{
  "jobId": "job_id_here",
  "coverLetter": "I am interested in this position..."
}
```

#### Get Application Details
```
GET /applications/:id
```

#### Update Application Status (Employer Only)
```
PUT /applications/:id/status
```

**Request Body:**
```json
{
  "status": "shortlisted",
  "notes": "Good candidate, schedule interview"
}
```

**Status Options:**
- `pending`
- `shortlisted`
- `rejected`
- `interview_scheduled`
- `hired`

#### Withdraw Application (Candidate Only)
```
DELETE /applications/:id
```

---

### Invitations

#### Get Invitation Details
```
GET /invitations/:id
```

#### Accept Invitation
```
PUT /invitations/:id/accept
```

#### Decline Invitation
```
PUT /invitations/:id/decline
```

---

### Notifications

#### Get Notifications
```
GET /notifications?unreadOnly=true&page=1&limit=20
```

#### Mark as Read
```
PUT /notifications/:id/read
```

#### Mark All as Read
```
PUT /notifications/read-all
```

#### Delete Notification
```
DELETE /notifications/:id
```

---

### Admin (Admin Only)

#### Get Pending Verifications
```
GET /admin/employers/pending
```

#### Approve Employer
```
PUT /admin/employers/:id/verify
```

#### Reject Employer
```
PUT /admin/employers/:id/reject
```

**Request Body:**
```json
{
  "reason": "Invalid documents provided"
}
```

#### Get All Jobs
```
GET /admin/jobs?page=1&limit=20
```

#### Deactivate Job
```
PUT /admin/jobs/:id/deactivate
```

#### Get All Candidates
```
GET /admin/candidates?page=1&limit=20
```

#### Suspend Candidate
```
PUT /admin/candidates/:id/suspend
```

#### Get Job Platform Statistics
```
GET /admin/stats/jobs
```

**Response:**
```json
{
  "success": true,
  "data": {
    "candidates": {
      "total": 150
    },
    "employers": {
      "total": 45,
      "verified": 30,
      "pendingVerification": 10
    },
    "jobs": {
      "active": 75
    },
    "applications": {
      "total": 320
    }
  }
}
```

---

## Matching Algorithm

The platform uses an intelligent matching algorithm that calculates compatibility scores between candidates and jobs:

### Scoring Weights
- **Skills Match**: 50%
- **Education Match**: 30%
- **Location Match**: 20%

### Skills Matching
Uses Jaccard similarity to compare skill sets:
```
Score = (Matching Skills / Total Unique Skills) × 100
```

### Education Matching
Based on education hierarchy:
- 10th < 12th < Diploma < Graduate < Post-Graduate
- 100% if candidate meets or exceeds requirement
- Proportional score if below requirement

### Location Matching
- Same city: 100 points
- Same state: 70 points
- Same country: 40 points
- Remote jobs: 100 points for all

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

- API requests: 100 per 15 minutes per IP
- Resume uploads: 10 per hour per user

---

## File Upload Constraints

### Resume Files
- Formats: PDF, DOCX
- Max size: 5MB
- Storage: Firebase Storage

### Verification Documents
- Formats: PDF, DOCX, JPG, PNG
- Max size: 5MB per file
- Max files: 5 per submission

---

## Notification Types

- `application_received`: Employer receives new application
- `invitation_received`: Candidate receives job invitation
- `application_status_update`: Application status changed
- `invitation_response`: Invitation accepted/declined
- `profile_view`: Profile-related notifications

---

## Development Notes

### Environment Variables Required
```env
MONGODB_URI=mongodb://localhost:27017/connecther
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NODE_ENV=development
PORT=5000
```

### Testing Without Firebase
For development, you can bypass Firebase auth by sending:
```
x-user-id: <valid MongoDB User ObjectId>
```

---

## Future Enhancements

- Email notifications via SendGrid
- Real-time chat via Socket.IO
- Video interviews
- AI resume parsing
- Advanced analytics
- Mobile app
- Payment integration for premium features
