# FindMyStay - Smart Hostel System

A modular accommodation platform helping students, youth, and women find safe hostels, compatible roommates, and affordable rental houses.

## Project Structure

```
e2e-project/
│
├── module-1-user-authentication/
│   ├── frontend/          # React app (Port 8081)
│   └── backend/           # Express API (Port 4001)
│
├── module-2-hostel-management/
│   ├── frontend/          # React app (Port 8082)
│   └── backend/           # Express API (Port 4002)
│
├── module-3-roommate-finder/
│   ├── frontend/          # React app (Port 8083)
│   └── backend/           # Express API (Port 4003)
│
├── module-4-admin-verification/
│   ├── frontend/          # React app (Port 8084)
│   └── backend/           # Express API (Port 4004)
│
└── README.md
```

## Modules Overview

### Module 1: User Authentication
**Features:**
- User registration with **mandatory confirm password validation**
- Login with JWT authentication
- Profile management
- Password hashing with bcrypt

**Ports:**
- Backend: 4001
- Frontend: 8081

**API Endpoints:**
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/profile`
- PUT `/api/auth/profile`

---

### Module 2: Hostel Management
**Features:**
- Create and manage hostel listings
- Search and filter by location, budget, type
- Photo gallery support
- Reviews and ratings system
- Verification workflow

**Ports:**
- Backend: 4002
- Frontend: 8082

**API Endpoints:**
- GET `/api/hostels`
- POST `/api/hostels`
- GET `/api/hostels/:id`
- PUT `/api/hostels/:id`
- DELETE `/api/hostels/:id`
- POST `/api/hostels/:id/reviews`

---

### Module 3: Roommate Finder
**Features:**
- Create roommate profile with preferences
- Intelligent matching algorithm with compatibility scoring
- Budget and location filtering
- Interest-based matching

**Ports:**
- Backend: 4003
- Frontend: 8083

**API Endpoints:**
- POST `/api/roommates/profile`
- GET `/api/roommates/profile/me`
- PUT `/api/roommates/profile`
- GET `/api/roommates/matches`

**Matching Algorithm:**
- Gender preference: 20 points
- Smoking: 15 points
- Food preference: 15 points
- Sleep schedule: 10 points
- Cleanliness: 10 points
- Common interests: 5 points each

---

### Module 4: Admin Verification
**Features:**
- Dashboard with statistics
- Hostel verification workflow
- User management
- Content moderation

**Ports:**
- Backend: 4004
- Frontend: 8084

**API Endpoints:**
- GET `/api/admin/stats`
- GET `/api/admin/hostels/pending`
- PUT `/api/admin/hostels/:id/verify`
- DELETE `/api/admin/hostels/:id/reject`
- GET `/api/admin/users`
- PUT `/api/admin/users/:id/verify`
- DELETE `/api/admin/users/:id`

---

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Module 1 Setup

**Backend:**
```bash
cd module-1-user-authentication/backend
npm install
copy .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

**Frontend:**
```bash
cd module-1-user-authentication/frontend
npm install
copy .env.example .env
npm start
```

### Module 2 Setup

**Backend:**
```bash
cd module-2-hostel-management/backend
npm install
copy .env.example .env
npm run dev
```

**Frontend:**
```bash
cd module-2-hostel-management/frontend
npm install
PORT=3001 npm start
```

### Module 3 Setup

**Backend:**
```bash
cd module-3-roommate-finder/backend
npm install
copy .env.example .env
npm run dev
```

**Frontend:**
```bash
cd module-3-roommate-finder/frontend
npm install
PORT=3002 npm start
```

### Module 4 Setup

**Backend:**
```bash
cd module-4-admin-verification/backend
npm install
copy .env.example .env
npm run dev
```

**Frontend:**
```bash
cd module-4-admin-verification/frontend
npm install
PORT=3003 npm start
```

---

## Technology Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcryptjs
- **Architecture**: Microservices (modular)

---

## Database Models

### User (Module 1)
- name, email, password (hashed), phone, gender
- role (user/admin), isVerified
- profilePicture, createdAt

### Hostel (Module 2)
- name, owner, address, contactNumber
- hostelType, facilities, roomTypes, photos
- description, rules, isVerified, rating, reviews

### RoommateProfile (Module 3)
- user, bio, age, occupation
- budget, preferredLocation
- preferences (gender, smoking, food, sleep, cleanliness)
- interests, lookingFor, isActive

---

## Key Features

✅ **Modular Architecture** - Each module runs independently
✅ **Confirm Password Validation** - Mandatory in registration
✅ **JWT Authentication** - Secure token-based auth
✅ **Smart Matching Algorithm** - Compatibility scoring for roommates
✅ **Search & Filter** - Location, budget, preferences
✅ **Admin Verification** - Complete workflow for content moderation
✅ **Reviews & Ratings** - User feedback system

---

## Development Notes

- Each module has its own backend server running on different ports
- All modules share the same MongoDB database
- Authentication middleware should be shared across modules
- Frontend modules can be integrated into a single app or run separately

---

## Next Steps

1. Integrate authentication across all modules
2. Build frontend components for modules 2, 3, 4
3. Add image upload functionality
4. Implement real-time chat
5. Add email notifications
6. Write tests
7. Deploy to production

---

## Support

For issues or questions, refer to individual module documentation or create an issue in the repository.
