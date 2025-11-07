# ConnectHer API Reference

## Base URL
```
http://localhost:5000
```

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

---

## Endpoints

### Authentication

#### Verify Token
```http
POST /api/auth/verify
```

**Body:**
```json
{
  "idToken": "firebase-id-token"
}
```

**Response:**
```json
{
  "user": {
    "_id": "user-id",
    "firebaseUid": "firebase-uid",
    "email": "user@example.com",
    "displayName": "User Name",
    "photoURL": "https://...",
    "isAdmin": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Stories

#### Get All Stories
```http
GET /api/stories?category=Career&page=1&limit=10
```

**Query Parameters:**
- `category` (optional): Filter by category (Career, Health, Education, Growth)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "stories": [
    {
      "_id": "story-id",
      "title": "My Career Journey",
      "content": "Story content...",
      "category": "Career",
      "author": {
        "_id": "user-id",
        "displayName": "User Name",
        "photoURL": "https://..."
      },
      "isAnonymous": false,
      "likes": ["user-id-1", "user-id-2"],
      "comments": [
        {
          "_id": "comment-id",
          "author": {
            "displayName": "Commenter Name"
          },
          "content": "Great story!",
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "pages": 5
}
```

#### Create Story
```http
POST /api/stories
```
🔒 **Requires Authentication**

**Body:**
```json
{
  "title": "My Story Title",
  "content": "Story content here...",
  "category": "Career",
  "isAnonymous": false
}
```

**Response:**
```json
{
  "story": {
    "_id": "story-id",
    "title": "My Story Title",
    "content": "Story content here...",
    "category": "Career",
    "author": { ... },
    "isAnonymous": false,
    "likes": [],
    "comments": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Like/Unlike Story
```http
PUT /api/stories/:id/like
```
🔒 **Requires Authentication**

**Response:**
```json
{
  "likes": 5,
  "userLiked": true
}
```

#### Add Comment
```http
POST /api/stories/:id/comments
```
🔒 **Requires Authentication**

**Body:**
```json
{
  "content": "Great story!"
}
```

**Response:**
```json
{
  "comment": {
    "_id": "comment-id",
    "author": {
      "_id": "user-id",
      "displayName": "User Name"
    },
    "content": "Great story!",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Comments
```http
GET /api/stories/:id/comments
```

**Response:**
```json
{
  "comments": [
    {
      "_id": "comment-id",
      "author": {
        "displayName": "User Name"
      },
      "content": "Great story!",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Businesses

#### Get All Businesses
```http
GET /api/businesses?category=Retail&bounds=-100,30,-90,40
```

**Query Parameters:**
- `category` (optional): Filter by category
- `bounds` (optional): Map bounds as "swLng,swLat,neLng,neLat"

**Response:**
```json
{
  "businesses": [
    {
      "_id": "business-id",
      "name": "Business Name",
      "description": "Business description...",
      "category": "Retail",
      "owner": {
        "_id": "user-id",
        "displayName": "Owner Name",
        "email": "owner@example.com"
      },
      "address": {
        "street": "123 Main St",
        "city": "City",
        "state": "State",
        "zipCode": "12345",
        "country": "USA"
      },
      "location": {
        "type": "Point",
        "coordinates": [-98.5795, 39.8283]
      },
      "contact": {
        "phone": "555-1234",
        "email": "business@example.com",
        "website": "https://example.com"
      },
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Business
```http
POST /api/businesses
```
🔒 **Requires Authentication**

**Body:**
```json
{
  "name": "My Business",
  "description": "Business description",
  "category": "Retail",
  "address": {
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipCode": "12345",
    "country": "USA"
  },
  "location": {
    "coordinates": [-98.5795, 39.8283]
  },
  "contact": {
    "phone": "555-1234",
    "email": "business@example.com",
    "website": "https://example.com"
  }
}
```

**Response:**
```json
{
  "business": { ... }
}
```

#### Get Business by ID
```http
GET /api/businesses/:id
```

**Response:**
```json
{
  "business": { ... }
}
```

---

### Admin Routes

🔒 **All admin routes require authentication AND admin privileges**

#### Get All Stories (Admin)
```http
GET /api/admin/stories
```

**Response:**
```json
{
  "stories": [ ... ]
}
```

#### Delete Story
```http
DELETE /api/admin/stories/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Story deleted successfully"
}
```

#### Get All Businesses (Admin)
```http
GET /api/admin/businesses
```

**Response:**
```json
{
  "businesses": [ ... ]
}
```

#### Delete Business
```http
DELETE /api/admin/businesses/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Business deleted successfully"
}
```

#### Get Platform Statistics
```http
GET /api/admin/stats
```

**Response:**
```json
{
  "totalUsers": 100,
  "totalStories": 250,
  "totalBusinesses": 75,
  "engagement": {
    "totalLikes": 500,
    "totalComments": 300
  }
}
```

---

## Data Models

### User
```javascript
{
  firebaseUid: String (unique, required),
  email: String (required),
  displayName: String,
  photoURL: String,
  isAdmin: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Story
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
    createdAt: Date
  }],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Business
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
    type: String (enum: ['Point']),
    coordinates: [Number] // [longitude, latitude]
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "stack": "..." // Only in development
}
```

---

## Testing with cURL

### Create a Story
```bash
curl -X POST http://localhost:5000/api/stories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "title": "Test Story",
    "content": "This is a test story",
    "category": "Career",
    "isAnonymous": false
  }'
```

### Get Stories
```bash
curl http://localhost:5000/api/stories?category=Career&page=1&limit=10
```

### Like a Story
```bash
curl -X PUT http://localhost:5000/api/stories/STORY_ID/like \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

---

## Rate Limiting

Currently, there are no rate limits implemented. For production, consider adding rate limiting middleware.

## CORS

CORS is enabled for all origins in development. For production, configure specific allowed origins in `backend/server.js`.
