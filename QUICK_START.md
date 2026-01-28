# Quick Start Guide - Travellr Platform

This guide will help you get the Travellr platform up and running quickly.

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js v18+ installed
- [ ] MongoDB installed (or MongoDB Atlas account)
- [ ] Redis installed (optional but recommended)
- [ ] Cloudinary account (free tier works)
- [ ] Stripe account (test mode is fine)
- [ ] SendGrid account or SMTP credentials

## Step-by-Step Setup

### Step 1: Clone and Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### Step 2: Configure Backend Environment

Edit `backend/.env` with your credentials:

```env
# Required - Change these!
MONGO_URI=mongodb://localhost:27017/travellr
JWT_SECRET=change_this_to_a_long_random_string
JWT_REFRESH_SECRET=change_this_to_another_random_string

# Cloudinary (Get from https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Stripe (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Email - Option 1: SendGrid
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Email - Option 2: Gmail SMTP
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Redis (if installed locally)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Step 3: Start Backend

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

Backend will run on: `http://localhost:5000`

### Step 4: Setup Frontend

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install --legacy-peer-deps

# Copy environment file
cp .env.example .env.local
```

### Step 5: Configure Frontend Environment

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 6: Start Frontend

```bash
# Development mode
npm run dev

# Build for production
npm run build
npm start
```

Frontend will run on: `http://localhost:3000`

## Quick Test Checklist

### Test Backend API

1. **Health Check**
```bash
curl http://localhost:5000/api/health
```

2. **Register a User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

3. **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Frontend

1. Open browser: `http://localhost:3000`
2. You should see the Travellr homepage
3. Try navigating to `/login` and `/register`

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution**: 
- Ensure MongoDB is running: `mongod`
- Or use MongoDB Atlas and update `MONGO_URI` with connection string

### Issue: Redis Connection Error
**Solution**: 
- Either install Redis or comment out Redis configuration
- Backend will still work without Redis (caching will be disabled)

### Issue: Cloudinary Upload Fails
**Solution**:
- Double-check your Cloudinary credentials in `.env`
- Ensure `CLOUDINARY_CLOUD_NAME`, `API_KEY`, and `API_SECRET` are correct

### Issue: Email Not Sending
**Solution**:
- For Gmail: Enable "Less secure app access" or use App Password
- For SendGrid: Verify your API key and sender email

### Issue: Stripe Payment Fails
**Solution**:
- Use test mode keys (starting with `sk_test_` and `pk_test_`)
- Use test card: `4242 4242 4242 4242`

### Issue: Frontend Can't Connect to Backend
**Solution**:
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Check CORS settings in backend

## Development Workflow

### Backend Development

1. **Watch for changes**:
```bash
cd backend
npm run dev
```

2. **Test with curl or Postman**
3. **Check logs** in console for errors

### Frontend Development

1. **Start dev server**:
```bash
cd frontend
npm run dev
```

2. **Hot reload** automatically updates on file changes
3. **Check browser console** for errors

## Database Seeds (Optional)

To populate the database with sample data:

```bash
cd backend
npm run seed
```

This will create:
- Sample users (customer, vendor, admin)
- Sample trips
- Sample bookings

## Testing Stripe Payments

### Test Card Numbers

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Auth**: 4000 0025 0000 3155

Use any future expiry date and any 3-digit CVC.

## Monitoring & Logs

### Backend Logs

Logs are written to console and `backend/logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

### Frontend Logs

Check browser console for client-side logs.

## Next Steps

1. **Create Admin User**:
   - Register a user
   - Manually set `role: 'admin'` in MongoDB
   - Or use seed data

2. **Create Vendor Account**:
   - Register as vendor through UI
   - Complete Stripe Connect onboarding
   - Upload required documents

3. **Create Test Trip**:
   - Login as vendor
   - Create a trip with images
   - Set departures and pricing
   - Publish trip

4. **Make Test Booking**:
   - Browse trips as customer
   - Select trip and departure
   - Complete booking with test card
   - Verify email confirmation

## Production Deployment

### Backend Deployment

1. Set `NODE_ENV=production`
2. Use production MongoDB (MongoDB Atlas recommended)
3. Use production Stripe keys
4. Set strong JWT secrets
5. Configure proper CORS origins
6. Enable Redis for caching
7. Set up monitoring (PM2, DataDog, etc.)

### Frontend Deployment

Recommended platforms:
- **Vercel** (easiest for Next.js)
- **Netlify**
- **AWS Amplify**
- **Custom server** with Nginx

```bash
cd frontend
npm run build
npm start
```

## Environment Variables Summary

### Backend (.env)
✅ NODE_ENV
✅ PORT
✅ CLIENT_URL
✅ MONGO_URI
✅ JWT_SECRET
✅ JWT_REFRESH_SECRET
✅ REDIS_HOST
✅ CLOUDINARY_* (3 variables)
✅ STRIPE_SECRET_KEY
✅ STRIPE_WEBHOOK_SECRET
✅ EMAIL_SERVICE
✅ SENDGRID_API_KEY or SMTP_*

### Frontend (.env.local)
✅ NEXT_PUBLIC_API_URL
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
✅ NEXT_PUBLIC_APP_URL

## Getting Help

1. **Check Documentation**: See `doc.md` for detailed documentation
2. **Check Implementation**: See `IMPLEMENTATION_SUMMARY.md`
3. **Check Logs**: Backend console and log files
4. **Check Console**: Browser developer console
5. **Check Issues**: Common issues section above

## Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm start           # Start production server
npm test            # Run tests
npm run lint        # Run linter

# Frontend
npm run dev         # Start development server
npm run build       # Build for production
npm start          # Start production server
npm run lint       # Run linter
```

## Port Configuration

Default ports:
- Backend API: `5000`
- Frontend: `3000`
- MongoDB: `27017`
- Redis: `6379`

To change ports, update:
- Backend: `PORT` in `.env`
- Frontend: `-p` flag or `next.config.js`

## Success Indicators

You know everything is working when:
- ✅ Backend starts without errors
- ✅ Frontend loads at localhost:3000
- ✅ Can register/login users
- ✅ Can create trips (as vendor)
- ✅ Can make bookings
- ✅ Emails are sent
- ✅ Images upload successfully
- ✅ Payments process with Stripe

---

**🎉 Happy Coding! The platform is ready for development!**

For detailed API documentation and features, refer to:
- `README.md` - General overview
- `doc.md` - Complete documentation (6,569 lines)
- `IMPLEMENTATION_SUMMARY.md` - What's been implemented
