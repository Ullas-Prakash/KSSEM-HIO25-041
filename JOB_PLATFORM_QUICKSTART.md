# Job Platform Quick Start Guide

## For Candidates

### 1. Create Your Profile
```bash
POST /api/candidates/profile
Authorization: Bearer <your-firebase-token>

{
  "personalInfo": {
    "fullName": "Your Name",
    "age": 25,
    "phone": "+91-1234567890",
    "location": {
      "city": "Mumbai",
      "state": "Maharashtra"
    }
  },
  "professionalInfo": {
    "skills": ["Typing", "MS Word", "Excel"],
    "education": {
      "level": "12th",
      "field": "Commerce"
    },
    "experience": {
      "years": 1,
      "description": "Data entry experience"
    }
  },
  "preferences": {
    "jobTypes": ["Part-Time", "Remote"],
    "preferredLocations": ["Mumbai"],
    "expectedSalary": {
      "min": 15000,
      "max": 25000
    }
  }
}
```

### 2. Upload Your Resume
```bash
POST /api/candidates/resume
Authorization: Bearer <your-firebase-token>
Content-Type: multipart/form-data

resume: <your-resume.pdf>
```

### 3. Get Matched Jobs
```bash
GET /api/candidates/matches?limit=10
Authorization: Bearer <your-firebase-token>
```

### 4. Apply for a Job
```bash
POST /api/applications
Authorization: Bearer <your-firebase-token>

{
  "jobId": "job_id_here",
  "coverLetter": "I am interested in this position..."
}
```

### 5. Check Your Applications
```bash
GET /api/candidates/applications
Authorization: Bearer <your-firebase-token>
```

### 6. View Invitations
```bash
GET /api/candidates/invitations
Authorization: Bearer <your-firebase-token>
```

### 7. Accept an Invitation
```bash
PUT /api/invitations/:id/accept
Authorization: Bearer <your-firebase-token>
```

---

## For Employers

### 1. Create Company Profile
```bash
POST /api/employers/profile
Authorization: Bearer <your-firebase-token>

{
  "companyInfo": {
    "name": "Your Company",
    "registrationNumber": "REG123456",
    "description": "Company description",
    "industry": "IT Services",
    "size": "11-50"
  },
  "contactInfo": {
    "phone": "+91-1234567890",
    "email": "hr@company.com",
    "address": {
      "city": "Mumbai",
      "state": "Maharashtra"
    }
  }
}
```

### 2. Submit Verification Documents
```bash
POST /api/employers/verify
Authorization: Bearer <your-firebase-token>
Content-Type: multipart/form-data

documents: <file1.pdf>
documents: <file2.pdf>
```

### 3. Check Verification Status
```bash
GET /api/employers/verification
Authorization: Bearer <your-firebase-token>
```

### 4. Post a Job (After Verification)
```bash
POST /api/jobs
Authorization: Bearer <your-firebase-token>

{
  "jobDetails": {
    "title": "Data Entry Operator",
    "description": "Looking for skilled data entry operators",
    "responsibilities": [
      "Enter data accurately",
      "Maintain records"
    ],
    "requirements": {
      "skills": ["Typing", "MS Word"],
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
      "isRemote": false
    },
    "salary": {
      "min": 15000,
      "max": 20000,
      "currency": "INR"
    }
  }
}
```

### 5. Get Matched Candidates
```bash
GET /api/jobs/:jobId/matches?limit=10
Authorization: Bearer <your-firebase-token>
```

### 6. View Applications
```bash
GET /api/jobs/:jobId/applications
Authorization: Bearer <your-firebase-token>
```

### 7. Update Application Status
```bash
PUT /api/applications/:applicationId/status
Authorization: Bearer <your-firebase-token>

{
  "status": "shortlisted",
  "notes": "Good candidate"
}
```

### 8. Invite a Candidate
```bash
POST /api/jobs/:jobId/invite
Authorization: Bearer <your-firebase-token>

{
  "candidateId": "candidate_id_here",
  "message": "We think you'd be a great fit!"
}
```

---

## For Admins

### 1. View Pending Verifications
```bash
GET /api/admin/employers/pending
Authorization: Bearer <admin-firebase-token>
```

### 2. Approve Employer
```bash
PUT /api/admin/employers/:employerId/verify
Authorization: Bearer <admin-firebase-token>
```

### 3. Reject Employer
```bash
PUT /api/admin/employers/:employerId/reject
Authorization: Bearer <admin-firebase-token>

{
  "reason": "Invalid documents"
}
```

### 4. View All Jobs
```bash
GET /api/admin/jobs
Authorization: Bearer <admin-firebase-token>
```

### 5. Get Platform Statistics
```bash
GET /api/admin/stats/jobs
Authorization: Bearer <admin-firebase-token>
```

---

## Common Workflows

### Candidate Journey
1. Sign up with Firebase Auth
2. Create candidate profile
3. Upload resume
4. Browse jobs or view matched jobs
5. Apply for jobs
6. Receive invitations from employers
7. Accept invitations (auto-creates application)
8. Track application status
9. Get notifications on status updates

### Employer Journey
1. Sign up with Firebase Auth
2. Create employer profile
3. Submit verification documents
4. Wait for admin approval
5. Post job openings
6. View matched candidates
7. Review applications
8. Send invitations to candidates
9. Update application statuses
10. Get notifications on responses

### Admin Journey
1. Monitor pending verifications
2. Review employer documents
3. Approve/reject employers
4. Monitor job postings
5. Moderate content if needed
6. View platform statistics
7. Manage user accounts

---

## Testing Tips

### Without Firebase (Development)
Send this header instead of Authorization:
```
x-user-id: <valid MongoDB User ObjectId>
```

### Test Data
Create test users with different roles:
- Candidate user
- Employer user
- Admin user

### Test Scenarios
1. Complete candidate profile → Apply for job
2. Complete employer profile → Get verified → Post job
3. Test matching algorithm with various skill combinations
4. Test invitation flow end-to-end
5. Test notification delivery

---

## Troubleshooting

### "Employer verification required"
- Employer must be verified by admin before posting jobs
- Check verification status: `GET /api/employers/verification`

### "Profile not found"
- Create profile first before other operations
- Candidates: `POST /api/candidates/profile`
- Employers: `POST /api/employers/profile`

### "File upload failed"
- Check file size (max 5MB)
- Check file type (PDF or DOCX only)
- Ensure Firebase Storage is configured

### "No matches found"
- Ensure profile is complete
- Check if there are active jobs/candidates
- Verify skills and location data

---

## Next Steps

1. **Frontend Integration**: Build React components for all features
2. **Email Notifications**: Integrate SendGrid
3. **Real-time Updates**: Add Socket.IO for live notifications
4. **Analytics**: Add tracking for user behavior
5. **Mobile App**: Create React Native version

---

## Support

For detailed API documentation, see [JOB_PLATFORM_API.md](backend/JOB_PLATFORM_API.md)

For implementation details, see [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
