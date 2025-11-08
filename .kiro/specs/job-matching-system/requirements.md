# Requirements Document

## Introduction

This document outlines the requirements for adding a Job & Opportunity Platform to the existing ConnectHer platform. The new feature will enable women seeking financial independence to create professional profiles, upload resumes, and connect with verified employers through an intelligent matching system. The platform will facilitate bidirectional discovery where candidates can search for jobs and employers can search for candidates, with automated matching based on skills, education, and preferences.

## Glossary

- **Job_Platform**: The new job and opportunity matching system being added to ConnectHer
- **Candidate**: A woman user who creates a professional profile to find employment opportunities
- **Employer**: A verified business user who posts job openings and searches for candidates
- **Job_Posting**: A job opportunity created by an Employer with specific requirements
- **Candidate_Profile**: A professional profile created by a Candidate including skills, education, and resume
- **Match_Score**: A numerical value representing compatibility between a Candidate and Job_Posting
- **Invitation**: A request sent by an Employer to a Candidate to apply for a specific job
- **Application**: A request sent by a Candidate to an Employer for a specific job
- **Resume_Storage**: Secure cloud storage system for uploaded resume files (PDF/DOCX)
- **Verification_Status**: The approval state of an Employer account (pending, verified, rejected)
- **Matching_Algorithm**: The automated system that calculates Match_Score based on skills, education, and location

## Requirements

### Requirement 1: Candidate Profile Management

**User Story:** As a woman seeking employment, I want to create a comprehensive professional profile with my skills and experience, so that employers can discover me and I can receive relevant job opportunities.

#### Acceptance Criteria

1. WHEN a Candidate completes registration, THE Job_Platform SHALL create a Candidate_Profile with fields for name, age, contact information, skills array, education level, work experience, preferred job types, and preferred locations
2. WHEN a Candidate uploads a resume file, THE Job_Platform SHALL validate the file format is PDF or DOCX with maximum size of 5MB
3. WHEN a Candidate uploads a valid resume, THE Job_Platform SHALL store the file in Resume_Storage and associate the file URL with the Candidate_Profile
4. WHEN a Candidate updates their Candidate_Profile, THE Job_Platform SHALL save the changes and update the timestamp of last modification
5. WHEN a Candidate views their profile, THE Job_Platform SHALL display all profile information including the uploaded resume download link

### Requirement 2: Employer Registration and Verification

**User Story:** As a small business owner, I want to register as a verified employer on the platform, so that I can post job openings and access candidate profiles with credibility.

#### Acceptance Criteria

1. WHEN an Employer completes registration, THE Job_Platform SHALL create an employer account with company name, business registration number, contact details, and set Verification_Status to pending
2. WHEN an Employer submits verification documents, THE Job_Platform SHALL store the documents and notify administrators for review
3. WHEN an administrator reviews an Employer, THE Job_Platform SHALL allow updating Verification_Status to verified or rejected with reason
4. IF Verification_Status is not verified, THEN THE Job_Platform SHALL restrict the Employer from posting jobs or viewing candidate contact information
5. WHEN Verification_Status changes to verified, THE Job_Platform SHALL send a notification to the Employer email address

### Requirement 3: Job Posting Creation and Management

**User Story:** As a verified employer, I want to post detailed job openings with specific requirements, so that suitable candidates can find and apply for positions.

#### Acceptance Criteria

1. WHERE Verification_Status is verified, THE Job_Platform SHALL allow the Employer to create a Job_Posting with job title, description, required skills array, minimum education level, experience requirements, salary range, job type, and location
2. WHEN an Employer creates a Job_Posting, THE Job_Platform SHALL validate all required fields are present and save the posting with status active
3. WHEN an Employer views their Job_Posting list, THE Job_Platform SHALL display all postings with application count and creation date
4. WHEN an Employer updates a Job_Posting, THE Job_Platform SHALL save changes and maintain the original creation timestamp
5. WHEN an Employer deletes a Job_Posting, THE Job_Platform SHALL set the status to inactive and preserve the data for historical records

### Requirement 4: Job Search and Discovery

**User Story:** As a candidate, I want to search for job opportunities that match my skills and preferences, so that I can find suitable employment quickly.

#### Acceptance Criteria

1. WHEN a Candidate performs a job search, THE Job_Platform SHALL accept filter parameters including keywords, location, job type, salary range, and education level
2. WHEN search filters are applied, THE Job_Platform SHALL return Job_Posting records where status is active and filters match the posting attributes
3. WHEN a Candidate views search results, THE Job_Platform SHALL display job title, company name, location, salary range, and required skills for each Job_Posting
4. WHEN a Candidate clicks on a Job_Posting, THE Job_Platform SHALL display complete job details including description, requirements, and application instructions
5. WHEN search results exceed 20 items, THE Job_Platform SHALL implement pagination with 20 results per page

### Requirement 5: Candidate Search and Discovery

**User Story:** As a verified employer, I want to search for candidates who match my job requirements, so that I can proactively invite qualified applicants.

#### Acceptance Criteria

1. WHERE Verification_Status is verified, THE Job_Platform SHALL allow the Employer to search candidates with filter parameters including skills, education level, experience, and location
2. WHEN search filters are applied, THE Job_Platform SHALL return Candidate_Profile records where profile is complete and filters match the candidate attributes
3. WHEN an Employer views candidate search results, THE Job_Platform SHALL display candidate name, skills, education, experience summary, and location without revealing contact information
4. WHEN an Employer clicks on a Candidate_Profile, THE Job_Platform SHALL display complete profile details excluding resume download until invitation is accepted
5. WHEN search results exceed 20 items, THE Job_Platform SHALL implement pagination with 20 results per page

### Requirement 6: Automated Job-Candidate Matching

**User Story:** As a platform user, I want the system to automatically suggest relevant matches between candidates and jobs, so that I can discover opportunities I might have missed.

#### Acceptance Criteria

1. WHEN a new Job_Posting is created, THE Matching_Algorithm SHALL calculate Match_Score for all active Candidate_Profile records based on skills overlap, education level compatibility, and location proximity
2. WHEN a new Candidate_Profile is completed, THE Matching_Algorithm SHALL calculate Match_Score for all active Job_Posting records based on skills overlap, education level compatibility, and location proximity
3. WHEN Match_Score is calculated, THE Matching_Algorithm SHALL assign 50% weight to skills match, 30% weight to education compatibility, and 20% weight to location proximity
4. WHEN a Candidate views their dashboard, THE Job_Platform SHALL display top 10 Job_Posting matches sorted by Match_Score in descending order
5. WHEN an Employer views a Job_Posting, THE Job_Platform SHALL display top 10 Candidate_Profile matches sorted by Match_Score in descending order

### Requirement 7: Job Applications

**User Story:** As a candidate, I want to apply for jobs that interest me, so that employers can review my profile and consider me for the position.

#### Acceptance Criteria

1. WHEN a Candidate clicks apply on a Job_Posting, THE Job_Platform SHALL create an Application record linking the Candidate_Profile and Job_Posting with status pending
2. WHEN an Application is created, THE Job_Platform SHALL send a notification to the Employer about the new application
3. WHEN an Employer views applications for a Job_Posting, THE Job_Platform SHALL display all Application records with candidate details and application date
4. WHEN an Employer reviews an Application, THE Job_Platform SHALL allow updating the status to shortlisted, rejected, or interview_scheduled
5. WHEN Application status changes, THE Job_Platform SHALL send a notification to the Candidate with the updated status

### Requirement 8: Employer Invitations

**User Story:** As a verified employer, I want to send job invitations to promising candidates, so that I can proactively recruit talent for my openings.

#### Acceptance Criteria

1. WHERE Verification_Status is verified, THE Job_Platform SHALL allow the Employer to send an Invitation to a Candidate for a specific Job_Posting
2. WHEN an Invitation is sent, THE Job_Platform SHALL create an Invitation record with status pending and send a notification to the Candidate
3. WHEN a Candidate receives an Invitation, THE Job_Platform SHALL display the invitation with job details and options to accept or decline
4. WHEN a Candidate accepts an Invitation, THE Job_Platform SHALL update Invitation status to accepted and create an Application record automatically
5. WHEN a Candidate declines an Invitation, THE Job_Platform SHALL update Invitation status to declined and notify the Employer

### Requirement 9: In-App Notifications

**User Story:** As a platform user, I want to receive real-time notifications about applications, invitations, and status updates, so that I can respond promptly to opportunities.

#### Acceptance Criteria

1. WHEN an Application is created, THE Job_Platform SHALL create a notification record for the Employer with notification type application_received
2. WHEN an Invitation is sent, THE Job_Platform SHALL create a notification record for the Candidate with notification type invitation_received
3. WHEN Application status changes, THE Job_Platform SHALL create a notification record for the Candidate with notification type application_status_update
4. WHEN a user logs in, THE Job_Platform SHALL display all unread notification records sorted by creation time in descending order
5. WHEN a user clicks on a notification, THE Job_Platform SHALL mark the notification as read and navigate to the relevant page

### Requirement 10: Admin Moderation Panel

**User Story:** As a platform administrator, I want to review and moderate employer verifications, job postings, and candidate profiles, so that I can maintain platform quality and safety.

#### Acceptance Criteria

1. WHEN an administrator accesses the admin panel, THE Job_Platform SHALL display pending employer verification requests with submitted documents
2. WHEN an administrator reviews an employer verification, THE Job_Platform SHALL allow approving or rejecting with a reason message
3. WHEN an administrator views reported Job_Posting records, THE Job_Platform SHALL display the posting details and allow setting status to inactive
4. WHEN an administrator views reported Candidate_Profile records, THE Job_Platform SHALL display the profile details and allow suspending the account
5. WHEN an administrator views platform statistics, THE Job_Platform SHALL display total counts of active candidates, verified employers, active jobs, and total applications
