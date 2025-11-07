# ConnectHer - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

Or use the root command:
```bash
npm run install-all
```

### Step 2: Set Up Firebase

1. Go to https://console.firebase.google.com/
2. Create a new project (or use existing)
3. Enable Authentication:
   - Click "Authentication" in left sidebar
   - Click "Get Started"
   - Enable "Email/Password" and "Google" sign-in methods
4. Get Web Credentials:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click web icon (</>)
   - Copy the config values
5. Get Admin SDK Credentials:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file

### Step 3: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user:
   - Go to Database Access
   - Add New Database User
   - Choose password authentication
4. Whitelist your IP:
   - Go to Network Access
   - Add IP Address (use 0.0.0.0/0 for development)
5. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

### Step 4: Get Google Maps API Key

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable APIs:
   - Go to "APIs & Services" > "Library"
   - Search for "Maps JavaScript API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

### Step 5: Configure Environment Variables

#### Backend (.env)

Create `backend/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/connecther?retryWrites=true&w=majority
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-private-key-here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com
PORT=5000
NODE_ENV=development
```

**Note:** For FIREBASE_PRIVATE_KEY, copy the entire private_key value from the Firebase Admin SDK JSON file, including the quotes and newline characters (\n).

#### Frontend (.env)

Create `frontend/.env`:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSy...
REACT_APP_API_URL=http://localhost:5000
```

### Step 6: Run the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The app will open at http://localhost:3000

## ✅ Verify Everything Works

1. **Homepage loads** - You should see the ConnectHer landing page
2. **Sign up** - Create a new account with email/password
3. **Create a story** - Go to Stories and share a test story
4. **Register a business** - Go to Businesses and add a test business
   - Click on the map to set coordinates
   - Fill in the form and submit
5. **View on map** - Your business should appear as a marker

## 🐛 Common Issues

### "Cannot connect to MongoDB"
- Check your MongoDB URI is correct
- Verify your IP is whitelisted in MongoDB Atlas
- Ensure your database password doesn't contain special characters (or URL encode them)

### "Firebase authentication error"
- Verify all Firebase config values are correct
- Check that authentication methods are enabled in Firebase Console
- Ensure FIREBASE_PRIVATE_KEY includes the full key with \n characters

### "Google Maps not loading"
- Verify REACT_APP_GOOGLE_MAPS_API_KEY is set
- Check that Maps JavaScript API is enabled in Google Cloud Console
- Try adding your localhost to API key restrictions

### "CORS error"
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in frontend .env matches backend URL
- Verify CORS is enabled in backend/server.js

## 🎯 Next Steps

1. **Create an admin user:**
   - Manually update a user in MongoDB to set `isAdmin: true`
   - Or add admin creation logic in your code

2. **Customize styling:**
   - Edit `frontend/tailwind.config.js` for custom colors
   - Modify components in `frontend/src/components/`

3. **Add more features:**
   - Email notifications
   - Image uploads for stories/businesses
   - Advanced search and filtering
   - User profiles

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Google Maps API Documentation](https://developers.google.com/maps/documentation)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 💡 Tips for Hackathon

- Focus on core features first
- Use the example .env files as templates
- Test authentication flow early
- Keep the UI simple and functional
- Deploy early to catch deployment issues

Good luck with your hackathon! 🚀
