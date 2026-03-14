# FindMyStay - Project Documentation

## Module Structure

### 1. User Authentication Module
**Location:** 
- Backend: `backend/controllers/user-authentication/`, `backend/models/user-authentication/`, `backend/routes/user-authentication/`
- Frontend: `frontend/src/components/user-authentication/`

**Features:**
- User registration with confirm password validation (mandatory)
- Login with JWT authentication
- Profile management
- Password hashing with bcrypt

**API Endpoints:**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile (protected)
- PUT `/api/auth/profile` - Update user profile (protected)

---

### 2. Hostel Management Module
**Location:**
- Backend: `backend/controllers/hostel-management/`, `backend/models/hostel-management/`, `backend/routes/hostel-management/`
- Frontend: `frontend/src/components/hostel-management/`

**Features:**
- Create hostel listings with complete details
- Search and filter by location, budget, facilities
- Photo gallery support
- Reviews and ratings
- Verification status

**API Endpoints:**
- GET `/api/hostels` - Get all verified hostels (with filters)
- POST `/api/hostels` - Create hostel (protected)
- GET `/api/hostels/:id` - Get hostel details
- PUT `/api/hostels/:id` - Update hostel (protected)
- DELETE `/api/hostels/:id` - Delete hostel (protected)
- POST `/api/hostels/:id/reviews` - Add review (protected)

---

### 3. Roommate Finder Module
**Location:**
- Backend: `backend/controllers/roommate-finder/`, `backend/models/roommate-finder/`, `backend/routes/roommate-finder/`
- Frontend: `frontend/src/components/roommate-finder/`

**Features:**
- Create roommate profile with preferences
- Compatibility matching algorithm
- Search by location, budget, preferences
- Compatibility scoring system
- Secure communication

**API Endpoints:**
- POST `/api/roommates/profile` - Create profile (protected)
- GET `/api/roommates/profile/me` - Get my profile (protected)
- PUT `/api/roommates/profile` - Update profile (protected)
- GET `/api/roommates/matches` - Find compatible matches (protected)
- GET `/api/roommates/profile/:id` - Get profile by ID (protected)

**Matching Algorithm:**
- Gender preference: 20 points
- Smoking preference: 15 points
- Food preference: 15 points
- Sleep schedule: 10 points
- Cleanliness: 10 points
- Common interests: 5 points each

---

### 4. Admin Verification Module
**Location:**
- Backend: `backend/controllers/admin-verification/`, `backend/routes/admin-verification/`
- Frontend: `frontend/src/components/admin-verification/`

**Features:**
- Admin dashboard with statistics
- Hostel verification workflow
- User verification
- Content moderation
- Delete/reject functionality

**API Endpoints:**
- GET `/api/admin/stats` - Dashboard statistics (admin only)
- GET `/api/admin/hostels/pending` - Get pending hostels (admin only)
- PUT `/api/admin/hostels/:id/verify` - Verify hostel (admin only)
- DELETE `/api/admin/hostels/:id/reject` - Reject hostel (admin only)
- GET `/api/admin/users` - Get all users (admin only)
- PUT `/api/admin/users/:id/verify` - Verify user (admin only)
- DELETE `/api/admin/users/:id` - Delete user (admin only)

---

## Database Models

### User Model
- name, email, password, phone, gender
- role (user/admin)
- isVerified status
- profilePicture

### Hostel Model
- name, owner, address, location
- contactNumber, email, hostelType
- facilities, roomTypes, photos
- description, rules
- isVerified, verifiedBy
- rating, reviews

### RoommateProfile Model
- user, bio, age, occupation
- budget (min/max)
- preferredLocation
- preferences (gender, smoking, drinking, pets, food, sleep, cleanliness)
- interests, lookingFor
- isActive status

---

## Security Features
- JWT authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Admin role-based access control
- Input validation

---

## Next Steps for Development

1. **Complete Frontend Components:**
   - Hostel listing and detail pages
   - Roommate finder interface
   - Admin dashboard
   - Search and filter components

2. **Add Features:**
   - Image upload with Cloudinary
   - Real-time chat for roommate communication
   - Email notifications
   - Payment integration

3. **Testing:**
   - Unit tests for controllers
   - Integration tests for APIs
   - Frontend component tests

4. **Deployment:**
   - Set up production database
   - Configure environment variables
   - Deploy backend and frontend
