# Travellr Platform - Quick Startup Reference

## 🚀 Start Both Frontend & Backend in One Command

### Windows Users

**Option 1: Using Node.js (Recommended - All Windows Versions)**
```bash
node scripts/start-both.js
```

**Option 2: Using PowerShell**
```powershell
./scripts/start-both.ps1
```

**Option 3: Using Batch File**
```cmd
.\scripts\start-both.bat
```

---

### Mac/Linux Users

**Using Shell Script**
```bash
chmod +x scripts/start-both.sh    # First time only
./scripts/start-both.sh
```

---

## 📍 What Gets Started?

```
✅ Backend API       → http://localhost:5000
✅ Frontend App      → http://localhost:3000
✅ API Documentation → http://localhost:5000/api/v1/docs
```

---

## 🎯 Pre-flight Checks (Automatic)

The scripts automatically:
- ✅ Check Node.js & npm installation
- ✅ Verify project directories exist
- ✅ Check for .env configuration files
- ✅ Install missing dependencies (auto npm install)
- ✅ Display startup summary with URLs

---

## 🛑 Stop Services

**Press Ctrl+C** in the terminal

All processes will gracefully shutdown.

---

## 📝 Mode Options

### Development Mode (Default)
```bash
node scripts/start-both.js         # or --dev
```
- Hot-reload enabled
- Detailed logging
- Development databases

### Production Mode
```bash
node scripts/start-both.js --prod
```
⚠️ Frontend requires build first:
```bash
cd frontend && npm run build && cd ..
node scripts/start-both.js --prod
```

---

## 🔑 Test Login Credentials

```
Customer: john.wilson@example.com / SecurePass123!@
Vendor:   raj.adventuretravel@example.com / VendorPass123!@
Admin:    admin@travellr.com / AdminPass123!@
```

---

## 💾 Using Existing Startup Methods

### Using Make
```bash
make dev              # Both services
make dev-backend      # Backend only
make dev-frontend     # Frontend only
```

### Using Docker
```bash
docker-compose up -d   # Start
docker-compose down    # Stop
```

### Manual (Separate Terminals)
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

---

## ⚠️ Common Issues & Fixes

**Port 5000/3000 already in use?**
```bash
# Windows PowerShell
Get-Process node | Stop-Process -Force

# Mac/Linux
lsof -i :5000 | grep LISTEN && kill -9 <PID>
```

**Dependencies not installed?**
```bash
cd backend && npm install
cd ../frontend && npm install
```

**MongoDB connection error?**
- Verify MONGODB_URI in backend/.env
- Check MongoDB Atlas credentials
- Check IP whitelist in MongoDB Atlas

---

## 📚 Full Documentation

For detailed information, see:
- [STARTUP_GUIDE.md](./STARTUP_GUIDE.md) - Complete guide
- [PROJECT_REVIEW_COMPLETE.md](./PROJECT_REVIEW_COMPLETE.md) - Full project overview

---

## ✅ Status

**Last Updated:** January 20, 2026
**Status:** ✅ Ready to Start
**Startup Scripts:** 4 available (Node.js, PowerShell, Batch, Shell)
