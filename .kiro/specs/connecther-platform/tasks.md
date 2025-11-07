# Implementation Plan

- [x] 1. Initialize project structure and dependencies




  - Create backend directory with Express.js setup and install dependencies (express, mongoose, cors, dotenv, nodemon)
  - Create frontend directory using create-react-app and install dependencies (react-router-dom, axios, tailwindcss, firebase, @react-google-maps/api)
  - Configure Tailwind CSS in frontend with tailwind.config.js and update index.css
  - Create .env.example files for both frontend and backend with all required environment variable placeholders
  - Set up .gitignore files to exclude node_modules and .env files
  - _Requirements: 6.1, 6.2, 6.4, 7.1, 7.4_




- [x] 2. Set up backend database connection and models

  - Create config/db.js with MongoDB Atlas connection logic using Mongoose
  - Implement User model with firebaseUid, email, displayName, photoURL, isAdmin fields and appropriate indexes
  - Implement Story model with title, content, category, author reference, likes array, comments subdocuments, and isActive flag
  - Implement Business model with name, description, location (GeoJSON), address, contact info, owner reference, and 2dsphere index


  - _Requirements: 6.1, 7.2, 2.3, 4.3_

- [x] 3. Configure Firebase authentication


  - Create frontend/src/firebaseConfig.js with Firebase SDK initialization using environment variables
  - Create frontend/src/context/AuthContext.jsx to manage authentication state with login, logout, and user data
  - Implement email/password signup and login functions in AuthContext


  - Implement Google OAuth sign-in function in AuthContext
  - Implement anonymous login function in AuthContext
  - _Requirements: 1.1, 1.2, 1.4, 1.5_



- [x] 4. Build authentication API and middleware


  - Create controllers/authController.js with verifyToken function that validates Firebase ID tokens and creates/updates users in MongoDB
  - Create routes/authRoutes.js with POST /api/auth/verify endpoint
  - Create middleware/authMiddleware.js to verify Firebase tokens on protected routes and attach user to request
  - Create middleware/adminMiddleware.js to check if authenticated user has admin role
  - _Requirements: 1.4, 6.1, 5.1_





- [ ] 5. Implement Story Hub backend functionality
  - Create controllers/storyController.js with functions for getStories, createStory, likeStory, addComment, getComments
  - Create routes/storyRoutes.js with GET /api/stories, POST /api/stories, PUT /api/stories/:id/like, POST /api/stories/:id/comments, GET /api/stories/:id/comments
  - Implement category filtering and pagination in getStories controller
  - Implement like toggle logic that adds/removes user from likes array and prevents duplicates




  - Implement anonymous story handling that excludes author information when isAnonymous is true
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 6. Implement Business Hub backend functionality
  - Create controllers/businessController.js with functions for getBusinesses, createBusiness, getBusinessById
  - Create routes/businessRoutes.js with GET /api/businesses, POST /api/businesses, GET /api/businesses/:id




  - Implement address geocoding in createBusiness to convert address to coordinates (can use a geocoding library or manual input for MVP)
  - Implement geospatial query in getBusinesses to filter businesses within map bounds
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 7. Implement admin panel backend functionality
  - Create controllers/adminController.js with functions for getAllStories, deleteStory, getAllBusinesses, deleteBusiness, getStats




  - Create routes/adminRoutes.js with GET /api/admin/stories, DELETE /api/admin/stories/:id, GET /api/admin/businesses, DELETE /api/admin/businesses/:id, GET /api/admin/stats
  - Implement soft delete by setting isActive to false instead of removing documents
  - Implement stats calculation for total users, stories, businesses, and engagement metrics
  - Apply adminMiddleware to all admin routes
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_




- [ ] 8. Set up Express server with routes and middleware
  - Create server.js with Express app initialization, CORS configuration, and JSON body parser
  - Mount all route handlers (/api/auth, /api/stories, /api/businesses, /api/admin)
  - Add global error handling middleware
  - Add database connection on server startup with error handling


  - Configure server to listen on PORT from environment variable with fallback to 5000
  - _Requirements: 6.3, 7.2_

- [x] 9. Build frontend routing and layout components

  - Create frontend/src/App.js with React Router setup for routes: /, /stories, /businesses, /login, /signup, /admin
  - Create components/Navbar.jsx with navigation links and authentication state display (login/logout button)
  - Create components/Footer.jsx with static footer content

  - Implement protected route wrapper for admin panel that redirects non-admin users
  - _Requirements: 7.3_

- [x] 10. Create authentication pages


  - Create pages/Login.jsx with email/password form, Google sign-in button, and anonymous login button
  - Create pages/Signup.jsx with email/password registration form and Google sign-in button
  - Implement form validation for email and password fields
  - Add error message display for authentication failures
  - Redirect to home page after successful authentication
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 11. Build Story Hub frontend


  - Create services/api.js with Axios instance configured with base URL and authentication token interceptor
  - Create components/StoryCard.jsx to display story title, content, category badge, like count, comment count, and like button
  - Create pages/Stories.jsx with story creation form (title, content, category dropdown, anonymous checkbox)
  - Implement story list display with category filter buttons in Stories.jsx
  - Implement like functionality that calls API and updates UI optimistically
  - Implement comment section that displays existing comments and allows adding new comments
  - _Requirements: 2.1, 2.2, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4_

- [x] 12. Build Business Hub frontend with Google Maps


  - Create components/BusinessCard.jsx to display business name, description, category, and contact information
  - Create pages/Businesses.jsx with business registration form (name, description, category, address fields, contact info)
  - Integrate @react-google-maps/api with GoogleMap component using REACT_APP_GOOGLE_MAPS_API_KEY
  - Implement map markers for each business using Marker component
  - Implement InfoWindow that displays BusinessCard when marker is clicked
  - Add business list sidebar that displays all businesses and allows filtering by category
  - _Requirements: 4.1, 4.2, 4.4, 4.5_

- [x] 13. Build admin panel frontend


  - Create pages/AdminPanel.jsx with tabs for Stories, Businesses, and Statistics
  - Implement stories moderation view that displays all stories with delete buttons
  - Implement businesses moderation view that displays all businesses with delete buttons
  - Implement statistics dashboard that displays total counts and engagement metrics
  - Add confirmation dialog before deleting content
  - _Requirements: 5.1, 5.2, 5.3, 5.4_



- [ ] 14. Create home page and final polish
  - Create pages/Home.jsx with hero section, platform description, and call-to-action buttons
  - Add responsive design adjustments for mobile devices across all components
  - Implement loading states for API calls throughout the application



  - Add toast notifications for success/error messages
  - _Requirements: 7.3, 7.4_

- [ ] 15. Create documentation and setup instructions
  - Create README.md with project overview, tech stack, setup instructions, and running commands
  - Document all environment variables needed in both .env.example files
  - Add instructions for obtaining Firebase credentials and Google Maps API key
  - Add instructions for setting up MongoDB Atlas cluster
  - Include separate sections for running frontend (npm start) and backend (npm run dev)
  - _Requirements: 6.2, 7.5_
