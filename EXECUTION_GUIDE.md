# FindMyStay - Execution Guide

## Prerequisites
1. Install Node.js (v14+)
2. Install MongoDB and start it
3. Open 8 terminals (or use VS Code split terminals)

---

## 🚀 Execute Individual Modules

### Module 1: User Authentication

**Terminal 1 - Backend (Port 4001):**
```bash
cd module-1-user-authentication/backend
npm install
copy .env.example .env
npm run dev
```

**Terminal 2 - Frontend (Port 8081):**
```bash
cd module-1-user-authentication/frontend
npm install
copy .env.example .env
set PORT=8081 && npm start
```

**Test:** Open http://localhost:8081

---

### Module 2: Hostel Management

**Terminal 3 - Backend (Port 4002):**
```bash
cd module-2-hostel-management/backend
npm install
copy .env.example .env
npm run dev
```

**Terminal 4 - Frontend (Port 8082):**
```bash
cd module-2-hostel-management/frontend
npm install
set PORT=8082 && npm start
```

**Test:** Open http://localhost:8082

---

### Module 3: Roommate Finder

**Terminal 5 - Backend (Port 4003):**
```bash
cd module-3-roommate-finder/backend
npm install
copy .env.example .env
npm run dev
```

**Terminal 6 - Frontend (Port 8083):**
```bash
cd module-3-roommate-finder/frontend
npm install
set PORT=8083 && npm start
```

**Test:** Open http://localhost:8083

---

### Module 4: Admin Verification

**Terminal 7 - Backend (Port 4004):**
```bash
cd module-4-admin-verification/backend
npm install
copy .env.example .env
npm run dev
```

**Terminal 8 - Frontend (Port 8084):**
```bash
cd module-4-admin-verification/frontend
npm install
set PORT=8084 && npm start
```

**Test:** Open http://localhost:8084

---

## 🎯 Execute ALL Modules at Once

### Step 1: Install All Dependencies (One-time setup)

```bash
# Module 1
cd module-1-user-authentication/backend && npm install && cd ../frontend && npm install && cd ../..

# Module 2
cd module-2-hostel-management/backend && npm install && cd ../frontend && npm install && cd ../..

# Module 3
cd module-3-roommate-finder/backend && npm install && cd ../frontend && npm install && cd ../..

# Module 4
cd module-4-admin-verification/backend && npm install && cd ../frontend && npm install && cd ../..
```

### Step 2: Setup Environment Files (One-time setup)

```bash
# Copy all .env.example to .env
copy module-1-user-authentication\backend\.env.example module-1-user-authentication\backend\.env
copy module-1-user-authentication\frontend\.env.example module-1-user-authentication\frontend\.env
copy module-2-hostel-management\backend\.env.example module-2-hostel-management\backend\.env
copy module-3-roommate-finder\backend\.env.example module-3-roommate-finder\backend\.env
copy module-4-admin-verification\backend\.env.example module-4-admin-verification\backend\.env
```

**Edit each .env file:**
- Set `MONGODB_URI=mongodb://localhost:27017/findmystay`
- Set `JWT_SECRET=your_secret_key_123`

### Step 3: Start All Backends

**Terminal 1:**
```bash
cd module-1-user-authentication/backend && npm run dev
```

**Terminal 2:**
```bash
cd module-2-hostel-management/backend && npm run dev
```

**Terminal 3:**
```bash
cd module-3-roommate-finder/backend && npm run dev
```

**Terminal 4:**
```bash
cd module-4-admin-verification/backend && npm run dev
```

### Step 4: Start All Frontends

**Terminal 5:**
```bash
cd module-1-user-authentication/frontend && set PORT=8081 && npm start
```

**Terminal 6:**
```bash
cd module-2-hostel-management/frontend && set PORT=8082 && npm start
```

**Terminal 7:**
```bash
cd module-3-roommate-finder/frontend && set PORT=8083 && npm start
```

**Terminal 8:**
```bash
cd module-4-admin-verification/frontend && set PORT=8084 && npm start
```

---

## 📊 Running Services

| Module | Backend | Frontend | Description |
|--------|---------|----------|-------------|
| Module 1 | http://localhost:4001 | http://localhost:8081 | User Authentication |
| Module 2 | http://localhost:4002 | http://localhost:8082 | Hostel Management |
| Module 3 | http://localhost:4003 | http://localhost:8083 | Roommate Finder |
| Module 4 | http://localhost:4004 | http://localhost:8084 | Admin Verification |

---

## ✅ Verify All Modules Running

**Check Backend Health:**
```bash
curl http://localhost:4001/health
curl http://localhost:4002/health
curl http://localhost:4003/health
curl http://localhost:4004/health
```

**Check Frontends:**
- http://localhost:8081 - User Auth
- http://localhost:8082 - Hostel Management
- http://localhost:8083 - Roommate Finder
- http://localhost:8084 - Admin Panel

---

## 🛑 Stop All Modules

Press `Ctrl + C` in each terminal to stop the servers.

---

## 💡 Quick Tips

1. **Start MongoDB first** before running backends
2. **Run backends before frontends** for proper API connection
3. **Use same JWT_SECRET** in all backend .env files
4. **Module 1 must run** for authentication to work in other modules
5. **All modules share same database**: `findmystay`

---

## 🔧 Troubleshooting

**Port already in use:**
```bash
# Kill process on port (Windows)
netstat -ano | findstr :4001
taskkill /PID <PID> /F
```

**MongoDB not running:**
```bash
# Start MongoDB service
net start MongoDB
```

**Dependencies error:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Development Workflow

1. Start MongoDB
2. Start all 4 backends (Terminals 1-4)
3. Start all 4 frontends (Terminals 5-8)
4. Register user on Module 1: http://localhost:8081/register
5. Use token to access other modules

---

**Ready to run!** 🚀
