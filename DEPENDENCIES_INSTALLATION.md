# DEPENDENCIES INSTALLATION GUIDE

**Date:** January 17, 2026  
**Status:** Missing dependencies identified

---

## 🔧 MISSING DEPENDENCIES

### Frontend Missing Packages

The following packages need to be installed for the frontend to compile correctly:

```bash
cd frontend

# Testing dependencies (REQUIRED for tests to work)
npm install --save-dev vitest @vitest/ui
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev redux-mock-store

# UI and utility dependencies (REQUIRED for components)
npm install react-datepicker
npm install date-fns
npm install leaflet
npm install recharts

# Type definitions
npm install --save-dev @types/jest @types/node
npm install --save-dev @types/react-datepicker
npm install --save-dev @types/leaflet
```

### Backend Missing Packages

The following packages need to be installed for the backend to work correctly:

```bash
cd backend

# Testing dependencies (REQUIRED)
npm install --save-dev jest
npm install --save-dev @types/jest
npm install --save-dev ts-jest
npm install --save-dev supertest

# PDF and reporting (for reporting service)
npm install pdfkit
npm install --save-dev @types/pdfkit

# Other required packages (if missing)
npm install nodemailer
npm install node-cron
npm install redis
npm install mongoose
npm install stripe
npm install cloudinary
npm install cors
npm install compression
```

---

## 📋 INSTALLATION INSTRUCTIONS

### Step 1: Install Frontend Dependencies

```bash
cd c:\Users\TechTeam\Desktop\Alok\travellr\frontend

# Install all dependencies
npm install

# Install specific missing packages
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom redux-mock-store
npm install react-datepicker leaflet recharts
npm install --save-dev @types/jest @types/react-datepicker @types/leaflet
```

### Step 2: Install Backend Dependencies

```bash
cd c:\Users\TechTeam\Desktop\Alok\travellr\backend

# Install all dependencies
npm install

# Install testing packages
npm install --save-dev jest @types/jest ts-jest supertest

# Install missing service packages
npm install pdfkit nodemailer
```

### Step 3: Verify Installation

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm test
```

---

## ✅ VERIFICATION CHECKLIST

After installation, verify:

- [ ] `npm ls` shows no unmet dependencies
- [ ] Frontend builds without errors: `npm run build`
- [ ] Backend tests run: `npm test`
- [ ] TypeScript compiles: No TS errors in IDE
- [ ] All imports resolve correctly

---

## 🚀 QUICK INSTALL SCRIPT

Run this script to install all missing dependencies:

```bash
# Navigate to project root
cd c:\Users\TechTeam\Desktop\Alok\travellr

# Frontend
cd frontend
npm install
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom redux-mock-store
npm install --save-dev @types/jest @types/react-datepicker @types/leaflet
npm install react-datepicker leaflet recharts

# Backend
cd ../backend
npm install
npm install --save-dev jest @types/jest ts-jest supertest
npm install pdfkit nodemailer

# Verify
cd ../frontend && npm run build
cd ../backend && npm test
```

---

## 📊 DEPENDENCY STATUS

### Frontend
```
✅ Core: next, react, react-dom - Installed
✅ Styling: tailwindcss, postcss - Installed
✅ State: redux-toolkit, react-redux - Installed
✅ Forms: react-hook-form, zod - Installed
✅ API: axios, @tanstack/react-query - Installed
✅ Icons: lucide-react - Installed
❌ Testing: vitest, @testing-library/react - MISSING
❌ Components: react-datepicker, leaflet, recharts - MISSING
❌ Types: @types/react-datepicker, @types/leaflet - MISSING
```

### Backend
```
✅ Framework: express - Installed
✅ Database: mongoose - Installed
✅ Auth: jsonwebtoken, bcryptjs - Installed
✅ Payment: stripe - Installed
✅ File Upload: cloudinary - Installed
✅ Caching: ioredis - Installed
✅ Email: nodemailer, handlebars - Installed
✅ Scheduling: node-cron - Installed
❌ Testing: jest, supertest - MISSING
❌ Reporting: pdfkit - MISSING
```

---

## 🔗 COMPLETE PACKAGE LIST

### Frontend Package.json (Updated)

```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-slot": "^1.2.4",
    "@reduxjs/toolkit": "^2.11.2",
    "@stripe/react-stripe-js": "^5.4.1",
    "@stripe/stripe-js": "^8.6.0",
    "@tanstack/react-query": "^5.90.12",
    "axios": "^1.13.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "framer-motion": "^12.23.26",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.562.0",
    "next": "^16.1.1",
    "react": "^19.2.3",
    "react-datepicker": "^4.25.0",
    "react-dom": "^19.2.3",
    "react-hook-form": "^7.69.0",
    "react-leaflet": "^5.0.0",
    "react-redux": "^9.2.0",
    "recharts": "^3.6.0",
    "tailwind-merge": "^3.4.0",
    "tailwindcss": "^3.3.0",
    "uuid": "^9.0.1",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@types/jest": "^29.5.11",
    "@types/leaflet": "^1.9.8",
    "@types/node": "25.0.3",
    "@types/react": "19.2.7",
    "@types/react-datepicker": "^4.23.5",
    "@vitest/ui": "^1.1.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^13.0.0",
    "postcss": "^8.4.0",
    "prettier": "^3.1.1",
    "redux-mock-store": "^1.5.4",
    "typescript": "5.9.3",
    "vitest": "^1.1.0"
  }
}
```

### Backend Package.json (Updated)

```json
{
  "devDependencies": {
    "@types/jest": "^29.5.11",
    "@types/node": "^20.10.6",
    "@types/supertest": "^6.0.2",
    "jest": "^29.7.0",
    "nodemon": "^3.0.2",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1"
  },
  "dependencies": {
    "pdfkit": "^0.13.0",
    "pdfkit-table": "^0.1.50"
  }
}
```

---

## 🔍 TROUBLESHOOTING

### Issue: "Cannot find module '@/lib/api/axios'"

**Solution:**
1. Verify tsconfig.json has path aliases configured
2. Run `npm install` in frontend directory
3. Restart VS Code
4. Clear `.next` cache: `rm -rf .next`

### Issue: "vitest not found"

**Solution:**
```bash
npm install --save-dev vitest @vitest/ui
```

### Issue: "react-datepicker not found"

**Solution:**
```bash
npm install react-datepicker
npm install --save-dev @types/react-datepicker
```

### Issue: "jest not found" (Backend)

**Solution:**
```bash
npm install --save-dev jest @types/jest ts-jest
```

---

## 📝 NEXT STEPS

1. **Install Missing Dependencies** (see above)
2. **Run Builds**
   - Frontend: `npm run build`
   - Backend: `npm test`
3. **Verify No Errors** - Check for compilation errors
4. **Run Development Servers**
   - Frontend: `npm run dev`
   - Backend: `npm run dev`

---

**Status:** Ready for dependency installation  
**Last Updated:** January 17, 2026
