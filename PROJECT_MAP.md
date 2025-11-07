# ConnectHer - Project Map

## 📂 Complete File Structure

```
hackio/
│
├── 📄 Documentation Files
│   ├── README.md                    ⭐ Main documentation
│   ├── QUICK_START.md              ⚡ 5-minute setup guide
│   ├── SETUP_GUIDE.md              📖 Detailed setup instructions
│   ├── API_REFERENCE.md            📡 Complete API documentation
│   ├── HACKATHON_CHECKLIST.md      ✅ Day-of checklist
│   ├── PROJECT_SUMMARY.md          📊 Project overview
│   └── PROJECT_MAP.md              📍 This file
│
├── 🔧 Configuration Files
│   ├── package.json                 📦 Root package file
│   └── .gitignore                   🚫 Git ignore rules
│
├── 🖥️ Backend (Node.js + Express)
│   ├── 📁 config/
│   │   ├── db.js                   🗄️ MongoDB connection
│   │   └── firebase.js             🔥 Firebase Admin setup
│   │
│   ├── 📁 controllers/
│   │   ├── authController.js       🔐 Authentication logic
│   │   ├── storyController.js      📖 Story CRUD operations
│   │   ├── businessController.js   🏢 Business CRUD operations
│   │   └── adminController.js      👑 Admin operations
│   │
│   ├── 📁 middleware/
│   │   ├── authMiddleware.js       🛡️ Token verification
│   │   └── adminMiddleware.js      👮 Admin access control
│   │
│   ├── 📁 models/
│   │   ├── User.js                 👤 User schema
│   │   ├── Story.js                📝 Story schema
│   │   └── Business.js             🏪 Business schema
│   │
│   ├── 📁 routes/
│   │   ├── authRoutes.js           🔑 Auth endpoints
│   │   ├── storyRoutes.js          📚 Story endpoints
│   │   ├── businessRoutes.js       🏢 Business endpoints
│   │   └── adminRoutes.js          ⚙️ Admin endpoints
│   │
│   ├── server.js                    🚀 Express server entry
│   ├── package.json                 📦 Backend dependencies
│   ├── .env.example                 📋 Environment template
│   └── .gitignore                   🚫 Backend ignore rules
│
└── 💻 Frontend (React + Tailwind)
    ├── 📁 public/
    │   └── index.html              🌐 HTML template
    │
    ├── 📁 src/
    │   ├── 📁 components/
    │   │   ├── Navbar.jsx          🧭 Navigation bar
    │   │   ├── Footer.jsx          👣 Footer component
    │   │   ├── StoryCard.jsx       📄 Story display card
    │   │   └── BusinessCard.jsx    🏪 Business info card
    │   │
    │   ├── 📁 context/
    │   │   └── AuthContext.jsx     🔐 Auth state management
    │   │
    │   ├── 📁 pages/
    │   │   ├── Home.jsx            🏠 Landing page
    │   │   ├── Stories.jsx         📖 Story hub page
    │   │   ├── Businesses.jsx      🗺️ Business hub page
    │   │   ├── Login.jsx           🔑 Login page
    │   │   ├── Signup.jsx          ✍️ Registration page
    │   │   └── AdminPanel.jsx      👑 Admin dashboard
    │   │
    │   ├── 📁 services/
    │   │   └── api.js              📡 Axios API client
    │   │
    │   ├── App.js                  🎯 Main app component
    │   ├── index.js                🚪 React entry point
    │   ├── index.css               🎨 Global styles
    │   └── firebaseConfig.js       🔥 Firebase client setup
    │
    ├── package.json                 📦 Frontend dependencies
    ├── tailwind.config.js          🎨 Tailwind configuration
    ├── postcss.config.js           ⚙️ PostCSS configuration
    ├── .env.example                📋 Environment template
    └── .gitignore                  🚫 Frontend ignore rules
```

## 🎯 Key Components Explained

### Backend Components

#### 🔐 Authentication Flow
```
User Login → authController.verifyToken() → Create/Update User in DB → Return User Data
```

#### 📖 Story Flow
```
Create Story → authMiddleware → storyController.createStory() → Save to MongoDB
Get Stories → storyController.getStories() → Return with pagination
Like Story → authMiddleware → storyController.likeStory() → Toggle like
```

#### 🏢 Business Flow
```
Register Business → authMiddleware → businessController.createBusiness() → Save with coordinates
Get Businesses → businessController.getBusinesses() → Filter by bounds/category
```

#### 👑 Admin Flow
```
Admin Action → authMiddleware → adminMiddleware → adminController → Soft delete/Stats
```

### Frontend Components

#### 🧭 Navigation Structure
```
App.js
├── Navbar (always visible)
├── Routes
│   ├── Home
│   ├── Stories
│   ├── Businesses
│   ├── Login
│   ├── Signup
│   └── AdminPanel (protected)
└── Footer (always visible)
```

#### 🔐 Auth Context Flow
```
AuthContext → Firebase Auth → Backend Verification → User State → All Components
```

#### 📡 API Service Flow
```
Component → api.js (Axios) → Add Auth Token → Backend API → Response → Component
```

## 🔄 Data Flow Diagram

```
┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │ HTTP/REST
       │ Firebase Token
       ▼
┌─────────────┐
│   Express   │
│   Server    │
└──────┬──────┘
       │ Mongoose
       ▼
┌─────────────┐
│  MongoDB    │
│   Atlas     │
└─────────────┘

┌─────────────┐
│  Firebase   │ ◄── Auth Verification
│    Auth     │
└─────────────┘

┌─────────────┐
│   Google    │ ◄── Map Display
│    Maps     │
└─────────────┘
```

## 📊 Feature Map

### 🏠 Home Page
- Hero section with CTA buttons
- Feature showcase (Story Hub + Business Hub)
- Statistics display
- Join community section

### 📖 Story Hub
- Story creation form (title, content, category, anonymous)
- Story list with cards
- Category filter buttons
- Like button (heart icon)
- Comment section
- Pagination

### 🗺️ Business Hub
- Business registration form
- Google Maps with markers
- Click map to set location
- Info windows on marker click
- Business list sidebar
- Category filtering

### 🔐 Authentication
- Email/password signup
- Email/password login
- Google OAuth button
- Anonymous login
- Protected routes
- Session persistence

### 👑 Admin Panel
- Stories management table
- Businesses management table
- Delete buttons (soft delete)
- Statistics cards
- Engagement metrics

## 🎨 UI Component Hierarchy

```
App
├── Navbar
│   ├── Logo/Brand
│   ├── Navigation Links
│   └── Auth Buttons
│
├── Page Content
│   ├── Home
│   │   ├── Hero Section
│   │   ├── Features Grid
│   │   ├── CTA Section
│   │   └── Stats Section
│   │
│   ├── Stories
│   │   ├── Create Form (if authenticated)
│   │   ├── Category Filters
│   │   └── Story Cards
│   │       ├── Author Info
│   │       ├── Content
│   │       ├── Like Button
│   │       └── Comments
│   │
│   ├── Businesses
│   │   ├── Register Form (if authenticated)
│   │   ├── Google Map
│   │   │   ├── Markers
│   │   │   └── Info Windows
│   │   └── Business List
│   │       └── Business Cards
│   │
│   ├── Login/Signup
│   │   ├── Email/Password Form
│   │   ├── Google Button
│   │   └── Anonymous Button
│   │
│   └── Admin Panel
│       ├── Tab Navigation
│       ├── Stories Table
│       ├── Businesses Table
│       └── Stats Dashboard
│
└── Footer
    ├── About Section
    ├── Quick Links
    └── Copyright
```

## 🔌 API Endpoint Map

```
/api
├── /auth
│   └── POST /verify                 🔐 Verify Firebase token
│
├── /stories
│   ├── GET /                        📖 Get all stories
│   ├── POST /                       ✍️ Create story (auth)
│   ├── PUT /:id/like               ❤️ Like story (auth)
│   ├── POST /:id/comments          💬 Add comment (auth)
│   └── GET /:id/comments           💬 Get comments
│
├── /businesses
│   ├── GET /                        🏢 Get all businesses
│   ├── POST /                       ➕ Register business (auth)
│   └── GET /:id                     🔍 Get business details
│
└── /admin
    ├── GET /stories                 📚 Get all stories (admin)
    ├── DELETE /stories/:id          🗑️ Delete story (admin)
    ├── GET /businesses              🏪 Get all businesses (admin)
    ├── DELETE /businesses/:id       🗑️ Delete business (admin)
    └── GET /stats                   📊 Get statistics (admin)
```

## 🗄️ Database Collections

```
MongoDB: connecther
│
├── users
│   ├── _id
│   ├── firebaseUid (unique)
│   ├── email
│   ├── displayName
│   ├── photoURL
│   ├── isAdmin
│   └── timestamps
│
├── stories
│   ├── _id
│   ├── title
│   ├── content
│   ├── category
│   ├── author (ref: users)
│   ├── isAnonymous
│   ├── likes [user refs]
│   ├── comments []
│   ├── isActive
│   └── timestamps
│
└── businesses
    ├── _id
    ├── name
    ├── description
    ├── category
    ├── owner (ref: users)
    ├── address {}
    ├── location (GeoJSON)
    ├── contact {}
    ├── isActive
    └── timestamps
```

## 🔐 Security Layers

```
Request
  ↓
CORS Check
  ↓
Route Handler
  ↓
authMiddleware (if protected)
  ├── Verify Firebase Token
  ├── Get User from DB
  └── Attach to req.user
  ↓
adminMiddleware (if admin route)
  └── Check req.user.isAdmin
  ↓
Controller Logic
  ↓
Response
```

## 📱 Responsive Breakpoints

```
Mobile:    < 768px   (md breakpoint)
Tablet:    768px - 1024px
Desktop:   > 1024px

Tailwind classes used:
- md:  Medium screens and up
- lg:  Large screens and up
```

## 🎯 User Journeys

### New User Journey
```
1. Land on Home page
2. Click "Sign Up"
3. Create account (email or Google)
4. Redirected to Home
5. Explore Stories or Businesses
6. Create first story/business
```

### Story Interaction Journey
```
1. Go to Stories page
2. Browse stories
3. Filter by category
4. Click like on story
5. Add comment
6. Create own story
```

### Business Registration Journey
```
1. Go to Businesses page
2. Click "Register Business"
3. Fill form
4. Click map to set location
5. Submit
6. See business on map
```

### Admin Journey
```
1. Login as admin
2. Access Admin Panel
3. View all content
4. Moderate (delete if needed)
5. Check statistics
```

## 📚 Documentation Map

```
Start Here
    ↓
QUICK_START.md ──→ Get running in 5 minutes
    ↓
SETUP_GUIDE.md ──→ Detailed setup steps
    ↓
README.md ──────→ Full documentation
    ↓
API_REFERENCE.md → API details
    ↓
HACKATHON_CHECKLIST.md → Day-of prep
    ↓
PROJECT_SUMMARY.md → Overview
    ↓
PROJECT_MAP.md ──→ This file
```

## 🚀 Deployment Map

```
Development
    ↓
Local Testing
    ↓
Git Repository
    ├── Frontend → Vercel/Firebase Hosting
    └── Backend → Render/Railway
    ↓
Production
```

## 🎓 Learning Path

```
Beginner
├── Understand project structure
├── Run locally
└── Make small UI changes

Intermediate
├── Modify existing features
├── Add new fields
└── Customize styling

Advanced
├── Add new features
├── Implement new APIs
└── Deploy to production
```

---

## 🎯 Quick Reference

**Start Backend**: `cd backend && npm run dev`
**Start Frontend**: `cd frontend && npm start`
**Backend URL**: http://localhost:5000
**Frontend URL**: http://localhost:3000
**Health Check**: http://localhost:5000/health

---

**This map provides a complete visual overview of the ConnectHer project structure and flow!**
