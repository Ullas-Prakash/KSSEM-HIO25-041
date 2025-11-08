# ConnectHer - Empower | Inspire | Grow

A comprehensive digital platform empowering women through storytelling, entrepreneurship, and employment opportunities. ConnectHer provides three main features:

- **Story Hub**: Share and discover inspiring stories across categories like Career, Health, Education, and Growth
- **Business Hub**: A map-based directory to discover and register women-led businesses
- **Job Platform**: Connect women seeking employment with verified employers through intelligent matching

## 🚀 Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- React Router DOM
- Axios
- Firebase Authentication
- Google Maps API (@react-google-maps/api)

### Backend
- Node.js
- Express.js
- MongoDB Atlas (Mongoose)
- Firebase Admin SDK
- Firebase Storage
- Multer (file uploads)
- CORS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Firebase project
- Google Maps API key

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hackio
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/connecther?retryWrites=true&w=majority
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com
PORT=5000
NODE_ENV=development
```

**Getting Firebase Admin Credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Copy the values from the downloaded JSON file to your `.env`

**Getting MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Click "Connect" > "Connect your application"
4. Copy the connection string and replace `<password>` with your database password

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../frontend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
REACT_APP_API_URL=http://localhost:5000
```

**Getting Firebase Web Credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Scroll down to "Your apps" and click the web icon (</>)
5. Register your app and copy the config values

**Getting Google Maps API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps JavaScript API"
4. Go to Credentials and create an API key
5. Restrict the key to your domain (optional but recommended)

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
hackio/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── firebase.js        # Firebase Admin setup
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── storyController.js
│   │   ├── businessController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Story.js
│   │   └── Business.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── storyRoutes.js
│   │   ├── businessRoutes.js
│   │   └── adminRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── StoryCard.jsx
│   │   │   └── BusinessCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Stories.jsx
│   │   │   ├── Businesses.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── index.css
│   │   └── firebaseConfig.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
└── README.md
```

## 🔑 Key Features

### Story Hub
- Create stories with title, content, and category
- Post anonymously or with your profile
- Like and comment on stories
- Filter stories by category
- Pagination support

### Business Hub
- Register women-led businesses
- Interactive Google Maps integration
- Click markers to view business details
- Filter businesses by category
- Location-based search

### Authentication
- Email/password signup and login
- Google OAuth integration
- Anonymous browsing
- Protected routes for authenticated users

### Job Platform (NEW!)
- **For Candidates:**
  - Create professional profiles with skills and experience
  - Upload resumes (PDF/DOCX)
  - Get intelligent job matches based on skills, education, and location
  - Apply for jobs with cover letters
  - Receive and respond to employer invitations
  - Track application status
  
- **For Employers:**
  - Create company profiles with verification
  - Post detailed job openings
  - Search and filter candidates
  - Get matched candidates for each job
  - Send invitations to promising candidates
  - Manage applications and update statuses
  
- **Intelligent Matching:**
  - 50% skills match (Jaccard similarity)
  - 30% education compatibility
  - 20% location proximity
  - Automatic match suggestions for both sides

### Admin Panel
- View all stories and businesses
- Soft delete content (marks as inactive)
- Platform statistics dashboard
- User engagement metrics
- **Job Platform Moderation:**
  - Approve/reject employer verifications
  - Monitor job postings
  - Manage candidate accounts
  - View job platform statistics

## 🔒 Security Features

- Firebase ID token verification
- Protected API routes with middleware
- Admin-only routes
- Environment-based configuration
- CORS enabled for cross-origin requests

## 🚀 Deployment

### Frontend (Vercel/Firebase Hosting)

1. Build the production bundle:
```bash
cd frontend
npm run build
```

2. Deploy to Vercel:
```bash
npm install -g vercel
vercel
```

Or deploy to Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Backend (Render/Railway)

1. Push your code to GitHub
2. Connect your repository to Render or Railway
3. Set environment variables in the platform dashboard
4. Deploy

## 📝 API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify Firebase token and create/update user

### Stories
- `GET /api/stories` - Get all stories (with pagination and filters)
- `POST /api/stories` - Create new story (auth required)
- `PUT /api/stories/:id/like` - Toggle like on story (auth required)
- `POST /api/stories/:id/comments` - Add comment (auth required)
- `GET /api/stories/:id/comments` - Get story comments

### Businesses
- `GET /api/businesses` - Get all businesses
- `POST /api/businesses` - Register business (auth required)
- `GET /api/businesses/:id` - Get business details

### Job Platform
- **Candidates:**
  - `POST /api/candidates/profile` - Create/update profile
  - `POST /api/candidates/resume` - Upload resume
  - `GET /api/candidates/matches` - Get matched jobs
  - `GET /api/candidates/applications` - Get applications
  - `GET /api/candidates/invitations` - Get invitations

- **Employers:**
  - `POST /api/employers/profile` - Create/update profile
  - `POST /api/employers/verify` - Submit verification
  - `POST /api/jobs` - Create job (verified only)
  - `GET /api/jobs/:id/matches` - Get matched candidates
  - `POST /api/jobs/:id/invite` - Invite candidate

- **Applications:**
  - `POST /api/applications` - Apply for job
  - `PUT /api/applications/:id/status` - Update status

- **Invitations:**
  - `PUT /api/invitations/:id/accept` - Accept invitation
  - `PUT /api/invitations/:id/decline` - Decline invitation

- **Notifications:**
  - `GET /api/notifications` - Get notifications
  - `PUT /api/notifications/:id/read` - Mark as read

**📖 Full API Documentation:** See [JOB_PLATFORM_API.md](backend/JOB_PLATFORM_API.md)

### Admin (Admin auth required)
- `GET /api/admin/stories` - Get all stories
- `DELETE /api/admin/stories/:id` - Soft delete story
- `GET /api/admin/businesses` - Get all businesses
- `DELETE /api/admin/businesses/:id` - Soft delete business
- `GET /api/admin/stats` - Get platform statistics
- **Job Platform:**
  - `GET /api/admin/employers/pending` - Get pending verifications
  - `PUT /api/admin/employers/:id/verify` - Approve employer
  - `GET /api/admin/jobs` - Get all jobs
  - `GET /api/admin/candidates` - Get all candidates
  - `GET /api/admin/stats/jobs` - Get job platform stats

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string is correct
- Verify Firebase credentials are properly formatted
- Ensure all environment variables are set

### Frontend can't connect to backend
- Verify `REACT_APP_API_URL` points to correct backend URL
- Check CORS is enabled in backend
- Ensure backend server is running

### Google Maps not loading
- Verify `REACT_APP_GOOGLE_MAPS_API_KEY` is set
- Check API key has Maps JavaScript API enabled
- Ensure billing is enabled in Google Cloud Console

### Firebase authentication errors
- Verify all Firebase config values are correct
- Check Firebase project has authentication methods enabled
- Ensure Firebase Admin SDK credentials match the project

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👥 Team

Built with ❤️ for the hackathon

---

**Happy Hacking! 🚀**
