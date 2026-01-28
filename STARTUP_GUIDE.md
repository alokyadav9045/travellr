# Travellr Platform - Startup Guide & Scripts

## 📋 Overview

This document provides comprehensive information about starting the Travellr full-stack application (Backend API + Frontend UI).

---

## 🎯 Quick Start

### Fastest Way (Use One Command)

#### **Windows (PowerShell)**
```powershell
# Navigate to project root
cd C:\Users\TechTeam\Desktop\Alok\travellr

# Option 1: Using Node.js (Recommended)
node scripts/start-both.js

# Option 2: Using PowerShell
.\scripts\start-both.ps1 -Mode dev

# Option 3: Using Batch file
.\scripts\start-both.bat dev
```

#### **Mac/Linux**
```bash
# Navigate to project root
cd ~/path/to/travellr

# Make script executable
chmod +x scripts/start-both.sh

# Run it
./scripts/start-both.sh dev
```

---

## 📁 Project Structure Overview

```
travellr/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── app.js             # Express app configuration
│   │   ├── server.js          # Server entry point
│   │   ├── config/            # Configuration files
│   │   │   ├── env.js         # Environment variables
│   │   │   ├── database.js    # MongoDB connection
│   │   │   ├── redis.js       # Redis cache
│   │   │   └── stripe.js      # Payment configuration
│   │   ├── controllers/       # API logic (7 controllers)
│   │   ├── routes/            # API routes (12+ route files)
│   │   ├── models/            # Mongoose schemas (13 models)
│   │   ├── middleware/        # Express middleware
│   │   ├── services/          # Business logic
│   │   ├── jobs/              # Cron jobs (3 jobs)
│   │   └── scripts/           # Utility scripts
│   ├── package.json           # Dependencies & scripts
│   ├── .env                   # Environment variables
│   └── Dockerfile            # Docker configuration
│
├── frontend/                   # Next.js React App
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions
│   │   ├── store/            # Redux store
│   │   └── types/            # TypeScript types
│   ├── package.json          # Dependencies & scripts
│   ├── next.config.js        # Next.js config
│   ├── tailwind.config.js    # Tailwind CSS config
│   ├── .env.local            # Environment variables
│   └── Dockerfile            # Docker configuration
│
├── scripts/                    # Startup scripts (NEW)
│   ├── start-both.js         # Node.js startup (Cross-platform)
│   ├── start-both.ps1        # PowerShell startup (Windows/Mac/Linux)
│   ├── start-both.bat        # Batch startup (Windows)
│   └── start-both.sh         # Shell startup (Mac/Linux)
│
└── [Config files]            # Makefile, docker-compose, etc.
```

---

## 🚀 Startup Scripts Explained

### 1. **start-both.js** (Recommended - Node.js based)

**Platform:** Windows, Mac, Linux (Cross-platform)

**Features:**
- ✅ Colored terminal output
- ✅ Service health monitoring
- ✅ Pre-flight checks (dependencies, env files)
- ✅ Parallel process management
- ✅ Graceful shutdown (Ctrl+C)

**Usage:**
```bash
# Development mode (default)
node scripts/start-both.js

# Production mode
node scripts/start-both.js --prod

# Test mode
node scripts/start-both.js --test
```

**What it does:**
1. Validates prerequisites (Node.js, npm)
2. Checks environment files (.env files)
3. Verifies dependencies are installed
4. Starts backend on port 5000
5. Starts frontend on port 3000
6. Monitors processes and displays logs
7. Provides graceful shutdown on Ctrl+C

---

### 2. **start-both.ps1** (PowerShell)

**Platform:** Windows, Mac (with PowerShell), Linux

**Features:**
- ✅ Native PowerShell integration
- ✅ Parallel job management
- ✅ Automatic dependency installation
- ✅ Colored output

**Usage:**
```powershell
# Development mode
./scripts/start-both.ps1 -Mode dev

# Production mode
./scripts/start-both.ps1 -Mode prod

# Test mode
./scripts/start-both.ps1 -Mode test

# Without flags (default: dev)
./scripts/start-both.ps1
```

**Prerequisites:**
```powershell
# First time only - set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

### 3. **start-both.bat** (Batch Script)

**Platform:** Windows only

**Features:**
- ✅ Native Windows batch
- ✅ Simple and straightforward
- ✅ Calls PowerShell for parallel execution

**Usage:**
```cmd
# Development mode
.\scripts\start-both.bat dev

# Production mode
.\scripts\start-both.bat prod
```

---

### 4. **start-both.sh** (Shell Script)

**Platform:** Mac, Linux, Unix-like systems

**Features:**
- ✅ POSIX shell compatible
- ✅ Colored output (ANSI codes)
- ✅ Trap-based cleanup
- ✅ Process management

**Usage:**
```bash
# Make executable (first time only)
chmod +x scripts/start-both.sh

# Development mode
./scripts/start-both.sh dev

# Production mode
./scripts/start-both.sh prod
```

---

## 📊 Service Details

### Backend API

| Property | Value |
|----------|-------|
| **Port** | 5000 |
| **Framework** | Express.js (Node.js) |
| **Entry Point** | `backend/src/server.js` |
| **Dev Command** | `npm run dev` (uses nodemon) |
| **Prod Command** | `npm start` |
| **Health Check** | `GET /health` |
| **API Docs** | `http://localhost:5000/api/v1/docs` (Swagger) |

**Key Features:**
- ✅ MongoDB Atlas integration
- ✅ Redis caching
- ✅ Stripe payment processing
- ✅ Email notifications
- ✅ Cron jobs (3 jobs running)
- ✅ WebSocket support
- ✅ JWT authentication

**Cron Jobs:**
1. **Cleanup Cron** - Removes expired data
2. **Payroll Cron** - Processes vendor payouts
3. **Reminder Cron** - Sends booking reminders

---

### Frontend App

| Property | Value |
|----------|-------|
| **Port** | 3000 |
| **Framework** | Next.js (React) |
| **Language** | TypeScript/JavaScript |
| **CSS Framework** | Tailwind CSS |
| **Entry Point** | `frontend/src/app` |
| **Dev Command** | `npm run dev` |
| **Prod Command** | `npm start` (requires build) |
| **Build Command** | `npm run build` |

**Key Features:**
- ✅ Server-side rendering (SSR)
- ✅ Static generation
- ✅ API routes
- ✅ Redux state management
- ✅ Responsive design
- ✅ Form validation (React Hook Form + Zod)
- ✅ Charts & analytics

**Technology Stack:**
- React 19
- Next.js 16
- Redux Toolkit
- React Query (TanStack Query)
- Tailwind CSS 3
- TypeScript
- Stripe integration
- Leaflet maps

---

## ⚙️ Environment Configuration

### Backend (.env required)

```bash
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/travellr
MONGODB_URI_PROD=<production-uri>

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redispassword

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# External Services
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASS=...

# API
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local recommended)

```bash
# API endpoint
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

---

## 🔍 Pre-flight Checks

All startup scripts perform these checks:

| Check | What it verifies | Action if missing |
|-------|------------------|-------------------|
| **Node.js** | Installed & in PATH | Exit with error |
| **npm** | Installed & in PATH | Exit with error |
| **Backend path** | Directory exists | Exit with error |
| **Frontend path** | Directory exists | Exit with error |
| **Backend .env** | File exists | Warning (may fail at runtime) |
| **Frontend .env** | File exists | Warning (uses defaults) |
| **Backend node_modules** | Dependencies installed | Auto-install via `npm install` |
| **Frontend node_modules** | Dependencies installed | Auto-install via `npm install` |

---

## 🎯 Service Startup Order

The scripts start services in this order:

```
1. Pre-flight checks validation
   ├─ Check Node.js/npm installation
   ├─ Verify project directories
   ├─ Check environment files
   └─ Auto-install missing dependencies

2. Backend service starts (Port 5000)
   ├─ Connects to MongoDB
   ├─ Connects to Redis
   ├─ Initializes cron jobs
   └─ Waits ~5-10 seconds for startup

3. Frontend service starts (Port 3000)
   ├─ 3-second delay (allows backend to initialize)
   ├─ Compiles Next.js app
   └─ Ready for development

4. Display startup summary
   ├─ Show running URLs
   ├─ Show API documentation URL
   └─ Display development tips
```

---

## 🌐 Access Points After Startup

Once services are running, access:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | User interface |
| Backend API | http://localhost:5000 | REST API |
| API Docs | http://localhost:5000/api/v1/docs | Swagger UI |
| Health Check | http://localhost:5000/health | API health status |
| MongoDB | localhost:27017 | Database (if local) |
| Redis | localhost:6379 | Cache server (if local) |

---

## 🛑 Stopping Services

### Using Startup Scripts

```bash
# Press Ctrl+C in the terminal
# All processes will be gracefully terminated
^C
```

### Manual Stopping (if script exits)

#### Windows PowerShell
```powershell
# Find and kill processes
Get-Process node | Stop-Process -Force

# Or specific ports
netstat -ano | findstr :5000  # Find process on port 5000
taskkill /PID <PID> /F         # Kill by process ID
```

#### Mac/Linux
```bash
# Kill by port
lsof -i :5000        # Find process on port 5000
kill -9 <PID>        # Kill process

# Or kill all node processes
killall node
```

---

## 📝 Development Modes

### Development Mode (--dev)
```bash
node scripts/start-both.js --dev
```
- ✅ Backend uses nodemon (hot-reload)
- ✅ Frontend uses Next.js dev server (hot-reload)
- ✅ Detailed logging enabled
- ✅ Best for development

### Production Mode (--prod)
```bash
node scripts/start-both.js --prod
```
⚠️ **Note:** Frontend requires build first
```bash
cd frontend
npm run build
cd ..
node scripts/start-both.js --prod
```
- ✅ Optimized builds
- ✅ Production environment variables used
- ✅ Better performance
- ✅ Reduced logging

### Test Mode (--test)
```bash
node scripts/start-both.js --test
```
- ✅ Test environment
- ✅ Can be used for CI/CD

---

## 🔧 Alternative Startup Methods

### Using Makefile
```bash
# Start both services (dev mode)
make dev

# Start only backend
make dev-backend

# Start only frontend
make dev-frontend
```

### Using Docker Compose
```bash
# Start all services (backend, frontend, MongoDB, Redis)
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Manual Startup (Individual)
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## 🐛 Troubleshooting

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Windows PowerShell
Get-Process | where {$_.ProcessName -eq 'node'} | Stop-Process -Force

# Mac/Linux
lsof -i :5000 | grep LISTEN
kill -9 <PID>

# Or change port in backend/.env
PORT=5001
```

### Issue: "MongoDB connection failed"

**Solution:**
```bash
# 1. Check if MongoDB is running
# 2. Verify MONGODB_URI in backend/.env
# 3. Check internet connection (if using Atlas)
# 4. Verify IP whitelist in MongoDB Atlas
```

### Issue: "Dependencies not installed"

**Solution:**
```bash
# Manual installation
cd backend && npm install
cd ../frontend && npm install
```

### Issue: "Scripts not executable (Mac/Linux)"

**Solution:**
```bash
chmod +x scripts/start-both.sh
chmod +x scripts/start-both.ps1
```

### Issue: "PowerShell execution policy"

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📊 Startup Performance

### Typical Startup Times

| Component | Time |
|-----------|------|
| Pre-flight checks | 1-2 sec |
| Backend startup | 5-10 sec |
| Frontend startup | 8-15 sec |
| Total | ~15-25 sec |

### System Requirements

| Requirement | Minimum | Recommended |
|------------|---------|------------|
| RAM | 2 GB | 4+ GB |
| Storage | 500 MB | 1+ GB |
| CPU | 1 Core | 2+ Cores |
| Node.js | v16 | v18+ |
| npm | v7 | v9+ |

---

## 📚 Available npm Scripts

### Backend Scripts
```bash
npm start           # Production start
npm run dev         # Development with hot-reload
npm test            # Run tests
npm run lint        # Run linter
npm run seed        # Seed database
npm run seed:detailed  # Seed with full data
npm run db:indexes  # Create database indexes
npm run cache:warm  # Warm Redis cache
npm run monitor     # Monitor system health
```

### Frontend Scripts
```bash
npm run dev         # Development server
npm run build       # Build for production
npm start           # Start production build
npm run lint        # Run linter
npm test            # Run tests
```

---

## 🎓 Learning Resources

- [Backend Documentation](../IMPLEMENTATION_COMPLETE.md)
- [Frontend Architecture](../PAGES_INVENTORY.md)
- [API Specification](../doc.md)
- [Deployment Guide](../DEPLOYMENT_GUIDE.md)
- [Testing Guide](../TESTING_GUIDE.md)

---

## ✅ Checklist Before Production

- [ ] Environment variables configured correctly
- [ ] Database backups scheduled
- [ ] Redis configured with password
- [ ] SSL certificates installed
- [ ] Stripe keys validated
- [ ] Email service configured
- [ ] Cloudinary account set up
- [ ] Logs properly rotated
- [ ] Cron jobs tested
- [ ] Load testing completed
- [ ] Security audit completed
- [ ] Monitoring and alerts set up

---

## 📞 Support

For issues or questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review log output (check `backend/logs/` directory)
3. Check MongoDB connection
4. Verify environment variables
5. Run `npm run validate:env` to validate backend config

---

**Last Updated:** January 20, 2026
**Version:** 1.0.0 (Full Stack Ready)
