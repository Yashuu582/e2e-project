# Database Connection Guide - FindMyStay

## Option 1: Local MongoDB (Recommended for Development)

### Step 1: Install MongoDB

**Windows:**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run as a Windows service automatically

**Verify Installation:**
```bash
mongod --version
```

### Step 2: Start MongoDB

**Windows (if not running):**
```bash
net start MongoDB
```

**Check if running:**
```bash
mongo
# or
mongosh
```

### Step 3: Configure Each Module

**Create .env files from examples:**

**Module 1:**
```bash
cd module-1-user-authentication/backend
copy .env.example .env
```

Edit `.env`:
```
PORT=4001
MONGODB_URI=mongodb://localhost:27017/findmystay
JWT_SECRET=findmystay_secret_key_2024
JWT_EXPIRE=7d
```

**Module 2:**
```bash
cd module-2-hostel-management/backend
copy .env.example .env
```

Edit `.env`:
```
PORT=4002
MONGODB_URI=mongodb://localhost:27017/findmystay
JWT_SECRET=findmystay_secret_key_2024
```

**Module 3:**
```bash
cd module-3-roommate-finder/backend
copy .env.example .env
```

Edit `.env`:
```
PORT=4003
MONGODB_URI=mongodb://localhost:27017/findmystay
JWT_SECRET=findmystay_secret_key_2024
```

**Module 4:**
```bash
cd module-4-admin-verification/backend
copy .env.example .env
```

Edit `.env`:
```
PORT=4004
MONGODB_URI=mongodb://localhost:27017/findmystay
JWT_SECRET=findmystay_secret_key_2024
```

### Step 4: Test Connection

Start any backend:
```bash
cd module-1-user-authentication/backend
npm install
npm run dev
```

You should see:
```
MongoDB Connected
Module 1 running on port 4001
```

---

## Option 2: MongoDB Atlas (Cloud - Free)

### Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free
3. Create a free cluster (M0)

### Step 2: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/findmystay?retryWrites=true&w=majority
```

### Step 3: Configure Modules

Replace `MONGODB_URI` in all `.env` files:

```
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/findmystay?retryWrites=true&w=majority
```

### Step 4: Whitelist IP Address

1. In Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)

---

## Quick Setup Script (Windows)

Create `setup-database.bat` in project root:

```batch
@echo off
echo Setting up database configuration...

cd module-1-user-authentication\backend
copy .env.example .env
echo PORT=4001 > .env
echo MONGODB_URI=mongodb://localhost:27017/findmystay >> .env
echo JWT_SECRET=findmystay_secret_key_2024 >> .env
echo JWT_EXPIRE=7d >> .env

cd ..\..\..\module-2-hostel-management\backend
copy .env.example .env
echo PORT=4002 > .env
echo MONGODB_URI=mongodb://localhost:27017/findmystay >> .env
echo JWT_SECRET=findmystay_secret_key_2024 >> .env

cd ..\..\..\module-3-roommate-finder\backend
copy .env.example .env
echo PORT=4003 > .env
echo MONGODB_URI=mongodb://localhost:27017/findmystay >> .env
echo JWT_SECRET=findmystay_secret_key_2024 >> .env

cd ..\..\..\module-4-admin-verification\backend
copy .env.example .env
echo PORT=4004 > .env
echo MONGODB_URI=mongodb://localhost:27017/findmystay >> .env
echo JWT_SECRET=findmystay_secret_key_2024 >> .env

cd ..\..\..
echo Done! Database configuration complete.
```

Run:
```bash
setup-database.bat
```

---

## Verify Database Connection

### Method 1: Check Backend Logs

Start any backend and look for:
```
MongoDB Connected
```

### Method 2: Use MongoDB Compass

1. Download: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. You should see `findmystay` database after first API call

### Method 3: Command Line

```bash
mongosh
use findmystay
show collections
```

---

## Database Structure

All modules share one database: **findmystay**

**Collections created automatically:**
- `users` (Module 1)
- `hostels` (Module 2)
- `roommateprofiles` (Module 3)

---

## Troubleshooting

### Error: "MongoServerError: connect ECONNREFUSED"

**Solution:**
```bash
# Start MongoDB
net start MongoDB
```

### Error: "Authentication failed"

**Solution:** Check username/password in connection string

### Error: "Database not found"

**Solution:** Database is created automatically on first write operation

### Check MongoDB Status

```bash
# Windows
sc query MongoDB

# If stopped, start it
net start MongoDB
```

---

## Complete Setup Commands

```bash
# 1. Start MongoDB
net start MongoDB

# 2. Setup all .env files
cd module-1-user-authentication/backend
copy .env.example .env
# Edit .env with your MongoDB URI

cd ../../module-2-hostel-management/backend
copy .env.example .env
# Edit .env

cd ../../module-3-roommate-finder/backend
copy .env.example .env
# Edit .env

cd ../../module-4-admin-verification/backend
copy .env.example .env
# Edit .env

# 3. Install dependencies
cd ../../module-1-user-authentication/backend
npm install

cd ../../module-2-hostel-management/backend
npm install

cd ../../module-3-roommate-finder/backend
npm install

cd ../../module-4-admin-verification/backend
npm install

# 4. Start backends
cd ../../module-1-user-authentication/backend
npm run dev
```

---

## Important Notes

✅ **Same Database:** All modules use `findmystay` database
✅ **Same JWT Secret:** Use same secret in all modules for authentication
✅ **Start MongoDB First:** Before running any backend
✅ **Auto-Create:** Collections are created automatically when you insert data

---

**Database is ready!** 🎉
