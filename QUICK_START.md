# ConnectHer - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (2 minutes)

```bash
# Backend
cd backend
npm install

# Frontend (open new terminal)
cd frontend
npm install
```

### Step 2: Get Your Credentials (15 minutes)

#### Firebase (5 minutes)
1. Go to https://console.firebase.google.com/
2. Create project → Enable Authentication (Email + Google)
3. Get Web Config: Project Settings → Your apps → Web app
4. Get Admin SDK: Project Settings → Service Accounts → Generate Key

#### MongoDB (5 minutes)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster → Create database user
3. Network Access → Add IP (0.0.0.0/0)
4. Connect → Get connection string

#### Google Maps (5 minutes)
1. Go to https://console.cloud.google.com/
2. Enable "Maps JavaScript API"
3. Create API Key

### Step 3: Configure Environment (3 minutes)

#### Backend `.env`
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
```

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/connecther
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
PORT=5000
NODE_ENV=development
```

#### Frontend `.env`
```bash
cd frontend
cp .env.example .env
# Edit .env with your credentials
```

```env
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456
REACT_APP_FIREBASE_APP_ID=1:123456:web:abc123
REACT_APP_GOOGLE_MAPS_API_KEY=AIza...
REACT_APP_API_URL=http://localhost:5000
```

### Step 4: Run the App (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Step 5: Test It! (2 minutes)

1. Open http://localhost:3000
2. Click "Sign Up" → Create account
3. Go to "Stories" → Share a story
4. Go to "Businesses" → Register a business
5. ✅ You're ready!

---

## 🎯 What You Get

### Pages
- **Home** - Landing page with hero section
- **Stories** - Share and browse stories
- **Businesses** - Map-based business directory
- **Login/Signup** - Authentication pages
- **Admin Panel** - Content moderation (for admins)

### Features
- ✅ Email/Password + Google + Anonymous login
- ✅ Create stories (with anonymous option)
- ✅ Like and comment on stories
- ✅ Register businesses with map location
- ✅ Interactive Google Maps
- ✅ Admin content moderation
- ✅ Responsive mobile design

---

## 🚨 Troubleshooting

### Backend won't start?
```bash
# Check MongoDB URI
# Verify Firebase credentials
# Ensure .env file exists
```

### Frontend won't start?
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Can't login?
```bash
# Check Firebase config in frontend .env
# Verify authentication is enabled in Firebase Console
# Clear browser cache
```

### Map not loading?
```bash
# Check Google Maps API key
# Verify Maps JavaScript API is enabled
# Check browser console for errors
```

---

## 📝 Quick Commands

### Install Everything
```bash
# From root directory
cd backend && npm install && cd ../frontend && npm install
```

### Run Both Servers
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

### Check if Running
- Backend: http://localhost:5000/health
- Frontend: http://localhost:3000

---

## 🎨 Quick Customizations

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: '#8B5CF6',    // Purple
  secondary: '#EC4899',  // Pink
  accent: '#F59E0B',     // Orange
}
```

### Change App Name
Search and replace "ConnectHer" in:
- `frontend/src/components/Navbar.jsx`
- `frontend/src/pages/Home.jsx`
- `frontend/public/index.html`

### Add Story Categories
Edit category arrays in:
- `frontend/src/pages/Stories.jsx`
- `backend/models/Story.js`

---

## 📚 Need More Help?

- **Full Setup**: See `SETUP_GUIDE.md`
- **API Docs**: See `API_REFERENCE.md`
- **Hackathon Prep**: See `HACKATHON_CHECKLIST.md`
- **Project Info**: See `PROJECT_SUMMARY.md`

---

## ✅ Pre-Demo Checklist

- [ ] Both servers running
- [ ] Can sign up and login
- [ ] Can create a story
- [ ] Can register a business
- [ ] Map shows business markers
- [ ] Mobile view works
- [ ] Demo account ready

---

## 🎉 You're Ready!

Your ConnectHer platform is now running!

**Next Steps:**
1. Create some test data
2. Test all features
3. Prepare your demo
4. Win the hackathon! 🏆

---

**Need help?** Check the other documentation files or the browser/terminal console for errors.

**Good luck! 🚀**
