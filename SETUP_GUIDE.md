# FindMyStay - Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

## Installation Steps

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your configuration:
# - Set MongoDB URI
# - Set JWT secret
# - Configure Cloudinary (optional)

# Start development server
npm run dev
```

Backend will run on: http://localhost:5000

### 2. Frontend Setup

```bash
# Navigate to frontend directory (in new terminal)
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Start development server
npm start
```

Frontend will run on: http://localhost:3000

### 3. Database Setup

Make sure MongoDB is running:
- **Local**: Start MongoDB service
- **Atlas**: Use connection string in .env

The application will automatically create collections on first use.

## Testing the Application

### 1. Test User Authentication
- Go to http://localhost:3000/register
- Register a new user (confirm password is mandatory)
- Login with credentials

### 2. Test API Endpoints

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "phone": "1234567890",
    "gender": "male"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Creating Admin User

To create an admin user, manually update the user in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@findmystay.com" },
  { $set: { role: "admin" } }
)
```

## Module Testing

### User Authentication ✅
- Register: http://localhost:3000/register
- Login: http://localhost:3000/login

### Hostel Management (Backend Ready)
- POST /api/hostels - Create hostel
- GET /api/hostels - List hostels
- GET /api/hostels/:id - Get hostel details

### Roommate Finder (Backend Ready)
- POST /api/roommates/profile - Create profile
- GET /api/roommates/matches - Find matches

### Admin Verification (Backend Ready)
- GET /api/admin/stats - Dashboard stats
- GET /api/admin/hostels/pending - Pending hostels

## Common Issues

### MongoDB Connection Error
- Check if MongoDB is running
- Verify MONGODB_URI in .env

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Set PORT=3001 in frontend/.env

### CORS Issues
- Backend already configured for CORS
- Check if frontend URL matches

## Next Development Steps

1. **Complete Frontend Components:**
   - Hostel listing page
   - Roommate finder interface
   - Admin dashboard

2. **Add Features:**
   - Image upload
   - Real-time chat
   - Email notifications

3. **Testing:**
   - Write unit tests
   - Integration tests
   - E2E tests

## Project Structure

See `PROJECT_STRUCTURE.md` for complete directory layout.

## API Documentation

See `DOCUMENTATION.md` for detailed API endpoints and features.

## Support

For issues or questions, refer to the documentation files or create an issue in the repository.
