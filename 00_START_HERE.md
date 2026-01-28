# 🚀 START HERE - Travellr Platform Quick Launch

## ⚡ ONE COMMAND TO START EVERYTHING

```bash
node scripts/start-both.js
```

**That's it!** Backend API and Frontend both start automatically.

---

## 🎯 What Gets Started?

```
✅ Backend API          → http://localhost:5000
✅ Frontend Website     → http://localhost:3000  
✅ API Documentation   → http://localhost:5000/api/v1/docs
✅ Health Check        → http://localhost:5000/health
```

---

## 🔑 Login Credentials (Use Immediately)

Choose a role and login:

| Role | Email | Password |
|------|-------|----------|
| **Customer** | john.wilson@example.com | SecurePass123!@ |
| **Vendor** | raj.adventuretravel@example.com | SecurePass123!@ |
| **Admin** | admin@travellr.com | SecurePass123!@ |

---

## 📚 Documentation (Choose Your Level)

| Time | Need | File |
|------|------|------|
| ⚡ 2 min | Quick overview | [QUICK_STARTUP.md](./QUICK_STARTUP.md) |
| 📖 15 min | Setup guide | [QUICK_START.md](./QUICK_START.md) |
| 📘 30 min | Complete reference | [STARTUP_GUIDE.md](./STARTUP_GUIDE.md) |
| 📚 20 min | Architecture review | [PROJECT_REVIEW_COMPLETE.md](./PROJECT_REVIEW_COMPLETE.md) |
| 📋 10 min | What's new | [DELIVERABLES_SUMMARY.md](./DELIVERABLES_SUMMARY.md) |

---

## 🛑 Stop Services

Press `Ctrl+C` in the terminal

---

## 🔧 Startup Options (All Platforms)

### Windows/Mac/Linux (Recommended)
```bash
node scripts/start-both.js          # Development mode
node scripts/start-both.js --prod   # Production mode
```

### PowerShell (Windows/Mac)
```powershell
./scripts/start-both.ps1 -Mode dev
```

### Shell (Mac/Linux)
```bash
./scripts/start-both.sh dev
```

### Batch (Windows Only)
```cmd
.\scripts\start-both.bat dev
```

### Using Make
```bash
make dev              # Both frontend & backend
make dev-backend      # Backend only
make dev-frontend     # Frontend only
```

### Using Docker
```bash
docker-compose up -d   # Start all services
docker-compose down    # Stop all services
```

---

## 📊 Project Overview

**Travellr** is a complete travel booking platform:

- 👥 **Customers:** Search, book, and review trips
- 🏢 **Vendors:** Create trips, manage bookings, track revenue  
- 🛡️ **Admins:** Manage platform, users, and analytics

**Built with:** Node.js • Express • MongoDB • React • Next.js

---

## 💾 What's Already Setup

✅ Database seeded with 52 sample documents
✅ All prices in Indian Rupees (₹)
✅ Test user accounts ready
✅ API documentation generated
✅ MongoDB & Redis configured
✅ Payment system (Stripe) configured
✅ Email notifications ready

---

## ⚠️ First-Time Setup

**Before running, ensure:**
- [ ] Node.js v16+ installed ([nodejs.org](https://nodejs.org))
- [ ] npm v7+ installed (comes with Node.js)
- [ ] `.env` file exists in `backend/` folder

**If .env is missing:**
```bash
cd backend
# Create .env with MongoDB URI and other config
# (See QUICK_START.md for template)
cd ..
```

---

## 🎓 Learning Path

### First 15 Minutes
1. Run: `node scripts/start-both.js`
2. Visit: http://localhost:3000
3. Login with credentials above
4. Explore the application

### First Hour
1. Read: [QUICK_STARTUP.md](./QUICK_STARTUP.md)
2. Review: [PROJECT_REVIEW_COMPLETE.md](./PROJECT_REVIEW_COMPLETE.md)
3. Check: http://localhost:5000/api/v1/docs

### First Day
1. Read: [STARTUP_GUIDE.md](./STARTUP_GUIDE.md)
2. Explore backend code in `backend/src/`
3. Explore frontend code in `frontend/src/`
4. Run tests if available

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | See [STARTUP_GUIDE.md](./STARTUP_GUIDE.md#-troubleshooting) |
| MongoDB error | Check MONGODB_URI in backend/.env |
| Node not found | Install from nodejs.org |
| Script won't run (Mac/Linux) | Run: `chmod +x scripts/start-both.sh` |
| Missing dependencies | Run: `node scripts/start-both.js` (auto-installs) |

---

## 📁 Files You Just Got

### 4 Startup Scripts
```
scripts/
├── start-both.js      ✅ Node.js (recommended)
├── start-both.ps1     ✅ PowerShell
├── start-both.bat     ✅ Batch
└── start-both.sh      ✅ Shell
```

### New Documentation
```
✅ STARTUP_GUIDE.md                (650+ lines)
✅ PROJECT_REVIEW_COMPLETE.md      (550+ lines)
✅ QUICK_STARTUP.md                (150+ lines)
✅ DELIVERABLES_SUMMARY.md         (450+ lines)
```

---

## 🎉 Ready?

```bash
node scripts/start-both.js
```

Then open: **http://localhost:3000**

---

## 📞 Need Help?

- **Quick start?** → [QUICK_STARTUP.md](./QUICK_STARTUP.md)
- **Complete guide?** → [STARTUP_GUIDE.md](./STARTUP_GUIDE.md)
- **Architecture?** → [PROJECT_REVIEW_COMPLETE.md](./PROJECT_REVIEW_COMPLETE.md)
- **Troubleshooting?** → See STARTUP_GUIDE.md troubleshooting section
- **API endpoints?** → http://localhost:5000/api/v1/docs (after startup)

---

**Status:** ✅ Everything Ready
**Date:** January 20, 2026
**Version:** 1.0.0 Production Ready

---

🚀 **Start now:** `node scripts/start-both.js`
