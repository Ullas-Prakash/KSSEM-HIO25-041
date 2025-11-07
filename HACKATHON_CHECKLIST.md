# ConnectHer Hackathon Checklist

## ✅ Pre-Hackathon Setup (Do This First!)

### Environment Setup
- [ ] Node.js installed (v14+)
- [ ] Git installed
- [ ] Code editor ready (VS Code recommended)
- [ ] Two terminal windows ready

### Firebase Setup
- [ ] Firebase project created
- [ ] Email/Password authentication enabled
- [ ] Google authentication enabled
- [ ] Web app registered in Firebase
- [ ] Firebase Admin SDK key downloaded
- [ ] All Firebase credentials copied to `.env` files

### MongoDB Setup
- [ ] MongoDB Atlas account created
- [ ] Free cluster created
- [ ] Database user created
- [ ] IP address whitelisted (0.0.0.0/0 for development)
- [ ] Connection string copied to backend `.env`

### Google Maps Setup
- [ ] Google Cloud project created
- [ ] Maps JavaScript API enabled
- [ ] API key created
- [ ] API key copied to frontend `.env`

### Installation
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] Both `.env` files created and configured

### Initial Test
- [ ] Backend starts without errors (`npm run dev`)
- [ ] Frontend starts without errors (`npm start`)
- [ ] Can access http://localhost:3000
- [ ] Can sign up with email/password
- [ ] Can log in successfully

---

## 🎯 Core Features Implementation

### Authentication ✅ (Already Implemented)
- [x] Email/password signup
- [x] Email/password login
- [x] Google OAuth login
- [x] Anonymous browsing
- [x] Protected routes
- [x] User session management

### Story Hub ✅ (Already Implemented)
- [x] Create story form
- [x] Story list display
- [x] Category filtering
- [x] Like functionality
- [x] Comment functionality
- [x] Anonymous posting option
- [x] Story cards with author info

### Business Hub ✅ (Already Implemented)
- [x] Business registration form
- [x] Google Maps integration
- [x] Map markers for businesses
- [x] Info windows on marker click
- [x] Business list display
- [x] Location coordinates input

### Admin Panel ✅ (Already Implemented)
- [x] Admin authentication check
- [x] Stories management view
- [x] Businesses management view
- [x] Delete functionality (soft delete)
- [x] Platform statistics dashboard
- [x] Engagement metrics

---

## 🚀 Hackathon Day Tasks

### Morning (Setup & Testing)
- [ ] Pull latest code
- [ ] Verify all services are running
- [ ] Test all core features
- [ ] Fix any critical bugs
- [ ] Create test data (stories, businesses)

### Midday (Enhancement & Polish)
- [ ] Improve UI/UX
- [ ] Add loading states
- [ ] Add error messages
- [ ] Test on mobile devices
- [ ] Add more sample data

### Afternoon (Demo Prep)
- [ ] Create demo account
- [ ] Prepare demo script
- [ ] Test demo flow
- [ ] Take screenshots
- [ ] Prepare presentation

### Optional Enhancements (If Time Permits)
- [ ] Add image upload for stories
- [ ] Add business photos
- [ ] Implement search functionality
- [ ] Add email notifications
- [ ] Add user profiles
- [ ] Add story categories icons
- [ ] Improve mobile responsiveness
- [ ] Add dark mode
- [ ] Add loading animations
- [ ] Add success toast notifications

---

## 🐛 Testing Checklist

### Authentication Flow
- [ ] Sign up with email/password works
- [ ] Login with email/password works
- [ ] Google sign-in works
- [ ] Anonymous browsing works
- [ ] Logout works
- [ ] Protected routes redirect to login
- [ ] User session persists on refresh

### Story Hub
- [ ] Can create a story
- [ ] Stories display correctly
- [ ] Category filter works
- [ ] Like button works
- [ ] Like count updates
- [ ] Can add comments
- [ ] Comments display correctly
- [ ] Anonymous stories hide author
- [ ] Pagination works (if implemented)

### Business Hub
- [ ] Can register a business
- [ ] Map loads correctly
- [ ] Can click map to set location
- [ ] Markers appear on map
- [ ] Clicking marker shows info window
- [ ] Business list displays correctly
- [ ] All business info shows properly

### Admin Panel
- [ ] Only admins can access
- [ ] All stories display
- [ ] Can delete stories
- [ ] All businesses display
- [ ] Can delete businesses
- [ ] Statistics show correctly
- [ ] Engagement metrics accurate

### Cross-Browser Testing
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

### Mobile Testing
- [ ] Responsive on mobile
- [ ] Navigation menu works
- [ ] Forms are usable
- [ ] Map works on mobile

---

## 📝 Demo Script

### 1. Introduction (30 seconds)
"ConnectHer is a platform empowering women through storytelling and entrepreneurship."

### 2. Story Hub Demo (1 minute)
- Show existing stories
- Filter by category
- Create a new story
- Like and comment on a story

### 3. Business Hub Demo (1 minute)
- Show map with businesses
- Click on a marker
- Register a new business
- Show it appears on map

### 4. Admin Panel Demo (30 seconds)
- Show statistics
- Demonstrate content moderation

### 5. Closing (30 seconds)
"ConnectHer provides a safe space for women to share experiences and support each other's businesses."

---

## 🎨 UI/UX Quick Wins

### Visual Improvements
- [ ] Consistent color scheme (already using Tailwind)
- [ ] Proper spacing and padding
- [ ] Hover effects on buttons
- [ ] Smooth transitions
- [ ] Loading spinners
- [ ] Empty states with helpful messages

### User Experience
- [ ] Clear error messages
- [ ] Success confirmations
- [ ] Helpful placeholder text
- [ ] Intuitive navigation
- [ ] Mobile-friendly forms
- [ ] Accessible color contrast

---

## 🚨 Common Issues & Quick Fixes

### Backend Won't Start
```bash
# Check MongoDB connection
# Verify .env file exists
# Check Firebase credentials format
```

### Frontend Won't Start
```bash
# Delete node_modules and reinstall
cd frontend
rm -rf node_modules
npm install
```

### Firebase Auth Not Working
```bash
# Verify all Firebase config values
# Check authentication methods are enabled
# Clear browser cache and cookies
```

### Map Not Loading
```bash
# Verify Google Maps API key
# Check API is enabled in Google Cloud
# Check browser console for errors
```

---

## 📦 Deployment (If Time Permits)

### Frontend (Vercel)
- [ ] Push code to GitHub
- [ ] Connect repo to Vercel
- [ ] Add environment variables
- [ ] Deploy

### Backend (Render)
- [ ] Push code to GitHub
- [ ] Create new Web Service on Render
- [ ] Add environment variables
- [ ] Deploy
- [ ] Update frontend API_URL

---

## 🎯 Judging Criteria Focus

### Innovation
- Unique combination of storytelling + business directory
- Anonymous posting feature
- Map-based business discovery

### Technical Implementation
- Full-stack application
- Real-time authentication
- Database integration
- API design
- Responsive design

### User Experience
- Clean, intuitive interface
- Easy navigation
- Mobile-friendly
- Helpful error messages

### Social Impact
- Empowers women
- Builds community
- Supports women-led businesses
- Safe space for sharing

---

## 📸 Screenshots to Take

- [ ] Homepage hero section
- [ ] Story Hub with stories
- [ ] Story creation form
- [ ] Business Hub with map
- [ ] Business registration form
- [ ] Admin panel dashboard
- [ ] Mobile view

---

## 🎉 Final Checklist Before Demo

- [ ] All features working
- [ ] Test data populated
- [ ] Demo account ready
- [ ] Presentation prepared
- [ ] Screenshots taken
- [ ] Code committed to GitHub
- [ ] README updated
- [ ] Team ready!

---

## 💡 Presentation Tips

1. **Start with the problem**: Women need platforms to share stories and grow businesses
2. **Show the solution**: Live demo of ConnectHer
3. **Highlight unique features**: Anonymous posting, map integration, community engagement
4. **Discuss impact**: How it empowers women
5. **Show technical skills**: Full-stack, authentication, database, APIs
6. **End with vision**: Future features and scalability

---

## 🏆 Good Luck!

Remember:
- Focus on core features first
- Keep it simple and functional
- Test frequently
- Have fun!
- You've got this! 🚀

---

**Need Help?**
- Check README.md for setup instructions
- Check SETUP_GUIDE.md for detailed steps
- Check API_REFERENCE.md for API documentation
- Check browser console for errors
- Check backend terminal for server errors
