# FindMyStay - Modular Architecture Guide

## 📁 Project Structure

```
e2e-project/
│
├── module-1-user-authentication/
│   ├── frontend/                    # React (Port 3000)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Register.js     ✅ Confirm password validation
│   │   │   │   └── Login.js
│   │   │   ├── context/
│   │   │   │   └── AuthContext.js
│   │   │   ├── services/
│   │   │   │   └── api.js
│   │   │   └── styles/
│   │   │       └── Auth.css
│   │   └── package.json
│   │
│   └── backend/                     # Express (Port 5001)
│       ├── models/
│       │   └── User.js             ✅ Password hashing
│       ├── controllers/
│       │   └── authController.js   ✅ Register, Login, Profile
│       ├── routes/
│       │   └── authRoutes.js
│       ├── middleware/
│       │   └── auth.js             ✅ JWT protection
│       └── server.js
│
├── module-2-hostel-management/
│   ├── frontend/                    # React (Port 3001)
│   │   └── src/
│   │       ├── components/         ⏳ To be built
│   │       └── styles/
│   │
│   └── backend/                     # Express (Port 5002)
│       ├── models/
│       │   └── Hostel.js           ✅ Complete model
│       ├── controllers/
│       │   └── hostelController.js ✅ CRUD + Search + Reviews
│       ├── routes/
│       │   └── hostelRoutes.js
│       └── server.js
│
├── module-3-roommate-finder/
│   ├── frontend/                    # React (Port 3002)
│   │   └── src/
│   │       ├── components/         ⏳ To be built
│   │       └── styles/
│   │
│   └── backend/                     # Express (Port 5003)
│       ├── models/
│       │   └── RoommateProfile.js  ✅ Preferences model
│       ├── controllers/
│       │   └── roommateController.js ✅ Matching algorithm
│       ├── routes/
│       │   └── roommateRoutes.js
│       └── server.js
│
└── module-4-admin-verification/
    ├── frontend/                    # React (Port 3003)
    │   └── src/
    │       ├── components/         ⏳ To be built
    │       └── styles/
    │
    └── backend/                     # Express (Port 5004)
        ├── controllers/
        │   └── adminController.js  ✅ Verification workflow
        ├── routes/
        │   └── adminRoutes.js
        └── server.js
```

---

## 🚀 Quick Start Guide

### Module 1: User Authentication

**Backend (Port 5001):**
```bash
cd module-1-user-authentication/backend
npm install
copy .env.example .env
# Edit .env: Set MONGODB_URI and JWT_SECRET
npm run dev
```

**Frontend (Port 3000):**
```bash
cd module-1-user-authentication/frontend
npm install
copy .env.example .env
# Edit .env: REACT_APP_API_URL=http://localhost:5001/api
npm start
```

**Test:**
- Register: http://localhost:3000/register
- Login: http://localhost:3000/login

---

### Module 2: Hostel Management

**Backend (Port 5002):**
```bash
cd module-2-hostel-management/backend
npm install
copy .env.example .env
npm run dev
```

**API Test:**
```bash
curl http://localhost:5002/api/hostels
```

---

### Module 3: Roommate Finder

**Backend (Port 5003):**
```bash
cd module-3-roommate-finder/backend
npm install
copy .env.example .env
npm run dev
```

**API Test:**
```bash
curl http://localhost:5003/health
```

---

### Module 4: Admin Verification

**Backend (Port 5004):**
```bash
cd module-4-admin-verification/backend
npm install
copy .env.example .env
npm run dev
```

**API Test:**
```bash
curl http://localhost:5004/api/admin/stats
```

---

## 📊 Module Details

### ✅ Module 1: User Authentication (COMPLETE)

**Backend Features:**
- User registration with **mandatory confirm password**
- Password hashing with bcrypt
- JWT token generation
- Login authentication
- Profile management
- Protected routes middleware

**Frontend Features:**
- Register form with confirm password field
- Login form
- Auth context for global state
- API service with token interceptor

**Database Model:**
```javascript
User {
  name, email, password (hashed), phone, gender
  role: 'user' | 'admin'
  isVerified: boolean
  profilePicture, createdAt
}
```

---

### ✅ Module 2: Hostel Management (Backend Complete)

**Backend Features:**
- Create hostel listings
- Search & filter (city, type, price)
- CRUD operations
- Reviews and ratings
- Verification status

**Database Model:**
```javascript
Hostel {
  name, owner, address, contactNumber
  hostelType: 'boys' | 'girls' | 'co-ed'
  facilities[], roomTypes[], photos[]
  description, rules[]
  isVerified, rating, reviews[]
}
```

**Frontend:** To be built

---

### ✅ Module 3: Roommate Finder (Backend Complete)

**Backend Features:**
- Create roommate profile
- Intelligent matching algorithm
- Compatibility scoring
- Budget & location filtering

**Matching Algorithm:**
```
Score Calculation:
- Gender preference: 20 points
- Smoking: 15 points
- Food preference: 15 points
- Sleep schedule: 10 points
- Cleanliness: 10 points
- Common interests: 5 points each
```

**Database Model:**
```javascript
RoommateProfile {
  user, bio, age, occupation
  budget: { min, max }
  preferredLocation: { city, areas[] }
  preferences: {
    gender, smoking, drinking, pets,
    foodPreference, sleepSchedule, cleanliness
  }
  interests[], lookingFor, isActive
}
```

**Frontend:** To be built

---

### ✅ Module 4: Admin Verification (Backend Complete)

**Backend Features:**
- Dashboard statistics
- Hostel verification workflow
- User management
- Content moderation

**Admin Operations:**
- View pending hostels
- Verify/reject hostels
- View all users
- Verify/delete users
- Dashboard stats

**Frontend:** To be built

---

## 🔗 Module Integration

### Shared Database
All modules connect to the same MongoDB database:
```
mongodb://localhost:27017/findmystay
```

### Authentication Flow
1. User registers/logs in via Module 1
2. Receives JWT token
3. Uses token to access protected routes in all modules

### Cross-Module Communication
- Module 2 references User model from Module 1
- Module 4 manages data from Modules 1 & 2
- Shared JWT secret across all modules

---

## 🛠️ Development Workflow

### Running All Modules

**Terminal 1 - Module 1 Backend:**
```bash
cd module-1-user-authentication/backend && npm run dev
```

**Terminal 2 - Module 1 Frontend:**
```bash
cd module-1-user-authentication/frontend && npm start
```

**Terminal 3 - Module 2 Backend:**
```bash
cd module-2-hostel-management/backend && npm run dev
```

**Terminal 4 - Module 3 Backend:**
```bash
cd module-3-roommate-finder/backend && npm run dev
```

**Terminal 5 - Module 4 Backend:**
```bash
cd module-4-admin-verification/backend && npm run dev
```

---

## 📝 Environment Configuration

Each module needs `.env` file:

**Module 1:**
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/findmystay
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

**Module 2:**
```
PORT=5002
MONGODB_URI=mongodb://localhost:27017/findmystay
JWT_SECRET=your_secret_key
```

**Module 3:**
```
PORT=5003
MONGODB_URI=mongodb://localhost:27017/findmystay
JWT_SECRET=your_secret_key
```

**Module 4:**
```
PORT=5004
MONGODB_URI=mongodb://localhost:27017/findmystay
JWT_SECRET=your_secret_key
```

---

## ✅ Implementation Status

| Module | Backend | Frontend | Status |
|--------|---------|----------|--------|
| Module 1: User Auth | ✅ Complete | ✅ Complete | Ready |
| Module 2: Hostel Mgmt | ✅ Complete | ⏳ Pending | Backend Ready |
| Module 3: Roommate | ✅ Complete | ⏳ Pending | Backend Ready |
| Module 4: Admin | ✅ Complete | ⏳ Pending | Backend Ready |

---

## 🎯 Next Steps

1. **Build Frontend for Modules 2, 3, 4**
2. **Integrate Auth across all modules**
3. **Add image upload (Cloudinary)**
4. **Implement real-time chat**
5. **Write tests**
6. **Deploy**

---

## 📚 API Documentation

See `README.md` for complete API endpoint documentation for each module.

---

## 🔐 Security Features

✅ Password hashing (bcrypt)
✅ JWT authentication
✅ Protected routes
✅ Admin role-based access
✅ Confirm password validation
✅ Input validation

---

**Project Status:** Modular architecture complete with all 4 modules ready for development! 🎉
