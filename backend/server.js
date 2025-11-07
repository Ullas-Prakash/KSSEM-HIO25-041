require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const storyRoutes = require('./routes/storyRoutes');
const businessRoutes = require('./routes/businessRoutes');
const adminRoutes = require('./routes/adminRoutes');
const schemeRoutes = require('./routes/schemeRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/schemes', schemeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ConnectHer API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

/*
 * DEVELOPER NOTES:
 * 
 * For local testing before Firebase is fully integrated:
 * - Send header: x-user-id: <valid MongoDB ObjectId of a User>
 * - This bypasses Firebase auth in development mode
 * 
 * When Firebase Admin middleware is ready:
 * - The authMiddleware will automatically use Firebase token verification
 * - Remove the x-user-id development bypass from authMiddleware.js
 * 
 * Business Hub Features:
 * - Geocoding: Set GEOCODER_PROVIDER=google and GEOCODER_API_KEY in .env
 * - Manual coordinates: Send latitude/longitude in POST request
 * - Map bounds filtering: Use neLat, neLng, swLat, swLng query params
 * 
 * See backend/TESTS.md for complete API testing examples
 */
