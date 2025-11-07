# ConnectHer Platform - Design Document

## Overview

ConnectHer is a full-stack web application built with a React frontend and Node.js/Express backend, using MongoDB Atlas for data persistence and Firebase for authentication. The platform consists of two primary feature areas (Story Hub and Business Hub) with social engagement capabilities and administrative controls.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  React App (Tailwind CSS) + Firebase Auth Client SDK        │
│  - Story Hub UI                                              │
│  - Business Hub UI (Google Maps)                             │
│  - Authentication Pages                                      │
│  - Admin Panel                                               │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST (Axios)
                     │ Firebase Auth Tokens
┌────────────────────▼────────────────────────────────────────┐
│                      API Server Layer                        │
│  Express.js + CORS + Firebase Admin SDK                     │
│  - Auth Routes (token verification)                         │
│  - Story Routes (CRUD + engagement)                         │
│  - Business Routes (CRUD + geocoding)                       │
│  - Admin Routes (moderation)                                │
└────────────────────┬────────────────────────────────────────┘
                     │ Mongoose ODM
┌────────────────────▼────────────────────────────────────────┐
│                     Data Layer                               │
│  MongoDB Atlas                                               │
│  - Users Collection                                          │
│  - Stories Collection                                        │
│  - Businesses Collection                                     │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React.js 18.x with functional components and hooks
- Tailwind CSS for styling
- React Router DOM v6 for routing
- Axios for HTTP requests
- Firebase Auth SDK for authentication
- @react-google-maps/api for map integration

**Backend:**
- Node.js with Express.js framework
- Mongoose for MongoDB object modeling
- Firebase Admin SDK for token verification
- CORS middleware for cross-origin requests
- dotenv for environment configuration

**Database:**
- MongoDB Atlas (cloud-hosted)

**Authentication:**
- Firebase Authentication (email/password, Google OAuth, anonymous)

## Components and Interfaces

### Frontend Components

#### Core Layout Components

**Navbar.jsx**
- Displays platform branding and navigation links
- Shows user authentication state (login/logout button)
- Responsive mobile menu
- Props: `user` (from AuthContext)

**Footer.jsx**
- Static footer with platform information
- Social media links
- Copyright notice

#### Feature Components

**StoryCard.jsx**
- Displays individual story with title, content preview, category badge
- Shows like count and comment count
- Handles like button interaction
- Props: `story` (object), `onLike` (function), `onComment` (function)

**BusinessCard.jsx**
- Displays business information in map info window
- Shows business name, description, category, contact info
- Props: `business` (object)

#### Page Components

**Home.jsx**
- Landing page with platform introduction
- Call-to-action buttons for Story Hub and Business Hub
- Featured stories/businesses carousel

**Stories.jsx**
- Story creation form (authenticated users only)
- Story list with category filters
- Pagination for story browsing
- Comment section for each story

**Businesses.jsx**
- Business registration form (authenticated users only)
- Google Maps component with business markers
- Business list sidebar
- Filter by category and location

**Login.jsx**
- Email/password login form
- Google sign-in button
- Anonymous login option
- Link to signup page

**Signup.jsx**
- Email/password registration form
- Google sign-in button
- Form validation
- Link to login page

**AdminPanel.jsx**
- Protected route (admin users only)
- Content moderation dashboard
- User activity statistics
- Flagged content review interface

### Backend API Endpoints

#### Authentication Routes (`/api/auth`)

```
POST /api/auth/verify
- Verifies Firebase ID token
- Creates/updates user in MongoDB
- Returns user data
- Body: { idToken: string }
- Response: { user: UserObject }
```

#### Story Routes (`/api/stories`)

```
GET /api/stories
- Retrieves all published stories
- Query params: category, page, limit
- Response: { stories: StoryObject[], total: number }

POST /api/stories
- Creates new story
- Requires authentication
- Body: { title, content, category, isAnonymous }
- Response: { story: StoryObject }

PUT /api/stories/:id/like
- Toggles like on story
- Requires authentication
- Response: { likes: number, userLiked: boolean }

POST /api/stories/:id/comments
- Adds comment to story
- Requires authentication
- Body: { content }
- Response: { comment: CommentObject }

GET /api/stories/:id/comments
- Retrieves comments for story
- Response: { comments: CommentObject[] }
```

#### Business Routes (`/api/businesses`)

```
GET /api/businesses
- Retrieves all active businesses
- Query params: category, bounds (map viewport)
- Response: { businesses: BusinessObject[] }

POST /api/businesses
- Creates new business listing
- Requires authentication
- Body: { name, description, category, address, contact }
- Response: { business: BusinessObject }

GET /api/businesses/:id
- Retrieves single business details
- Response: { business: BusinessObject }
```

#### Admin Routes (`/api/admin`)

```
GET /api/admin/stories
- Retrieves all stories including flagged
- Requires admin authentication
- Response: { stories: StoryObject[] }

DELETE /api/admin/stories/:id
- Soft deletes story
- Requires admin authentication
- Response: { success: boolean }

GET /api/admin/businesses
- Retrieves all businesses including inactive
- Requires admin authentication
- Response: { businesses: BusinessObject[] }

DELETE /api/admin/businesses/:id
- Soft deletes business
- Requires admin authentication
- Response: { success: boolean }

GET /api/admin/stats
- Retrieves platform statistics
- Requires admin authentication
- Response: { totalUsers, totalStories, totalBusinesses, engagement }
```

## Data Models

### User Model

```javascript
{
  firebaseUid: String (unique, required),
  email: String (required),
  displayName: String,
  photoURL: String,
  isAdmin: Boolean (default: false),
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

### Story Model

```javascript
{
  title: String (required, max: 200),
  content: String (required),
  category: String (enum: ['Career', 'Health', 'Education', 'Growth'], required),
  author: ObjectId (ref: 'User', required),
  isAnonymous: Boolean (default: false),
  likes: [ObjectId] (ref: 'User'),
  comments: [{
    author: ObjectId (ref: 'User'),
    content: String (required),
    createdAt: Date (default: Date.now)
  }],
  isActive: Boolean (default: true),
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

### Business Model

```javascript
{
  name: String (required, max: 100),
  description: String (required),
  category: String (required),
  owner: ObjectId (ref: 'User', required),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  location: {
    type: String (enum: ['Point'], default: 'Point'),
    coordinates: [Number] // [longitude, latitude]
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  isActive: Boolean (default: true),
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

**Indexes:**
- User: `firebaseUid` (unique)
- Story: `category`, `createdAt`, `isActive`
- Business: `location` (2dsphere for geospatial queries), `category`, `isActive`

## Error Handling

### Frontend Error Handling

**Authentication Errors:**
- Display user-friendly messages for Firebase auth errors
- Redirect to login on 401 responses
- Show toast notifications for errors

**API Errors:**
- Axios interceptor for global error handling
- Display error messages in UI components
- Retry logic for network failures

**Form Validation:**
- Client-side validation before submission
- Display inline error messages
- Prevent submission with invalid data

### Backend Error Handling

**Middleware Stack:**
```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

**Error Types:**
- Authentication errors (401)
- Authorization errors (403)
- Validation errors (400)
- Not found errors (404)
- Database errors (500)

**Logging:**
- Console logging for development
- Structured error logging for production

## Testing Strategy

### Frontend Testing

**Component Testing:**
- Test rendering of key components (StoryCard, BusinessCard)
- Test user interactions (like button, form submission)
- Test routing and navigation

**Integration Testing:**
- Test authentication flow
- Test API integration with mock responses
- Test form validation

### Backend Testing

**Unit Testing:**
- Test controller functions
- Test model validation
- Test utility functions

**API Testing:**
- Test all endpoints with various inputs
- Test authentication middleware
- Test error handling

**Database Testing:**
- Test CRUD operations
- Test query performance
- Test data validation

### Manual Testing Checklist

- [ ] User registration and login flows
- [ ] Story creation and display
- [ ] Like and comment functionality
- [ ] Business registration and map display
- [ ] Admin panel access and moderation
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

## Security Considerations

**Authentication:**
- Firebase ID tokens verified on backend
- Tokens included in Authorization header
- Token expiration handled gracefully

**Authorization:**
- Route-level protection for authenticated endpoints
- Admin role verification for admin routes
- User ownership verification for updates/deletes

**Data Validation:**
- Input sanitization on backend
- Mongoose schema validation
- XSS prevention in user-generated content

**Environment Security:**
- Sensitive credentials in environment variables
- .env files excluded from version control
- Different configs for dev/prod environments

## Deployment Architecture

**Frontend (Vercel/Firebase Hosting):**
- Static build deployment
- Environment variables configured in platform
- Custom domain support
- CDN for asset delivery

**Backend (Render/Railway):**
- Node.js runtime environment
- Environment variables configured in platform
- Auto-deploy from Git repository
- Health check endpoint

**Database (MongoDB Atlas):**
- Cloud-hosted cluster
- IP whitelist configuration
- Database user authentication
- Automated backups

## Development Workflow

**Local Development:**
1. Clone repository
2. Install dependencies: `npm install` in both frontend and backend
3. Copy .env.example to .env and fill in credentials
4. Start MongoDB connection (Atlas)
5. Start backend: `npm run dev` (uses nodemon)
6. Start frontend: `npm start`
7. Access app at http://localhost:3000

**Environment Variables:**

Frontend (.env):
```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_GOOGLE_MAPS_API_KEY=
REACT_APP_API_URL=http://localhost:5000
```

Backend (.env):
```
MONGODB_URI=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
PORT=5000
NODE_ENV=development
```
