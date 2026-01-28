# Package Dependencies - Installation Guide

## Backend Dependencies

### Install New Production Dependencies
```bash
cd backend
npm install swagger-jsdoc@^6.2.8 swagger-ui-express@^5.0.0 winston@^3.11.0 handlebars@^4.7.8
```

### Updated package.json (additions only)
```json
{
  "dependencies": {
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "winston": "^3.11.0",
    "handlebars": "^4.7.8",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "test": "jest --coverage",
    "lint": "eslint .",
    "load-test": "node src/test-load.js"
  }
}
```

---

## Frontend Dependencies

### Install New Production Dependencies
```bash
cd frontend
npm install framer-motion@^10.16.4 date-fns@^2.30.0
```

### Updated package.json (additions only)
```json
{
  "dependencies": {
    "framer-motion": "^10.16.4",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Environment Variables

### Backend (.env)
```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://admin:password@localhost:27017/travellr?authSource=admin
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password
MONGO_DB=travellr

# Redis
REDIS_URL=redis://:redispassword@localhost:6379
REDIS_PASSWORD=redispassword

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=30d

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@travellr.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=travellr-uploads

# Frontend URL
FRONTEND_URL=http://localhost:3000

# API URL
API_URL=http://localhost:5000
```

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key

# Site Configuration
NEXT_PUBLIC_SITE_NAME=Travellr
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
NEXT_PUBLIC_YANDEX_VERIFICATION=your-verification-code

# Social Media
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/travellr
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/travellr
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/travellr
```

---

## Installation Steps

### 1. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create logs directory
mkdir -p logs

# Start development server
npm run dev
```

### 2. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Docker Setup (Recommended)
```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Verification

### Check Backend
```bash
# Health check
curl http://localhost:5000/api/health

# API Documentation
Open browser: http://localhost:5000/api-docs
```

### Check Frontend
```bash
# Open browser
http://localhost:3000
```

### Check Database
```bash
# MongoDB
mongosh "mongodb://admin:password@localhost:27017/travellr?authSource=admin"

# Redis
redis-cli -a redispassword
```

---

## Common Issues

### 1. Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <PID> /F
```

### 2. MongoDB Connection Error
- Ensure MongoDB is running
- Check credentials in .env
- Verify connection string format

### 3. Redis Connection Error
- Ensure Redis is running
- Check password in .env
- Verify Redis URL format

### 4. Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Production Deployment Checklist

- [ ] Update all environment variables with production values
- [ ] Change JWT_SECRET to a strong random string
- [ ] Use production database with backups
- [ ] Enable SSL/TLS in Nginx config
- [ ] Set up domain and DNS records
- [ ] Configure email service (SendGrid, AWS SES, etc.)
- [ ] Set up monitoring and logging
- [ ] Enable rate limiting
- [ ] Configure CDN for static assets
- [ ] Set up automated backups
- [ ] Enable HTTPS redirect
- [ ] Configure firewall rules
- [ ] Set up CI/CD pipeline
- [ ] Run security audit
- [ ] Load test the application
- [ ] Set up error tracking (Sentry)

---

## Quick Start Commands

```bash
# Development with Docker
docker-compose up -d

# Development without Docker
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev

# Run load tests
cd backend && npm run load-test

# View API docs
http://localhost:5000/api-docs

# Access application
http://localhost:3000
```

---

## Support

If you encounter any issues:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Ensure all services are running
4. Check port availability
5. Refer to main documentation: `PHASE2_IMPLEMENTATION_COMPLETE.md`
