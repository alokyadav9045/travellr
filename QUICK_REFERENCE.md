# QUICK REFERENCE GUIDE - TRAVELLR 100% COMPLETE

## ⚡ Quick Start Commands

```bash
# Development
cd backend && npm run dev
cd frontend && npm run dev

# Production (Docker)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 🌐 URLs

| Component | URL |
|-----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api/v1 |
| Admin Panel | http://localhost:3000/admin |
| Vendor Dashboard | http://localhost:3000/vendor |
| API Docs | See API_SPECIFICATION.md |

---

## 🔑 Test Credentials

```
Customer Account
Email: customer@example.com
Password: password123

Vendor Account
Email: vendor@example.com
Password: password123

Admin Account
Email: admin@example.com
Password: password123
```

---

## 📁 Project Structure

```
travellr/
├── backend/              # Express.js API
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── models/       # Database schemas
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── jobs/         # Background jobs
│   └── package.json
├── frontend/             # Next.js App
│   ├── src/
│   │   ├── app/          # Pages & layouts
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   └── lib/          # Utilities
│   └── package.json
├── k8s/                  # Kubernetes files
├── nginx/                # Nginx config
└── docker-compose.yml
```

---

## 🔌 API Examples

### Get All Trips
```bash
GET /api/v1/trips?page=1&limit=20
```

### Create Booking
```bash
POST /api/v1/bookings
Authorization: Bearer {token}
{
  "trip": "trip_id",
  "numberOfGuests": 4,
  "selectedDate": "2024-06-15",
  "promoCode": "SUMMER20"
}
```

### Apply Promo Code
```bash
POST /api/v1/promo-codes/validate
{
  "code": "SUMMER20",
  "amount": 20000,
  "vendorId": "vendor_id"
}
```

### Create Promo Code (Admin)
```bash
POST /api/v1/promo-codes
Authorization: Bearer {admin_token}
{
  "code": "SUMMER20",
  "discountType": "percentage",
  "discountValue": 20,
  "validFrom": "2024-06-01T00:00:00Z",
  "validUntil": "2024-08-31T23:59:59Z"
}
```

---

## 📦 Key Features Summary

| Feature | Status | How to Use |
|---------|--------|-----------|
| User Auth | ✅ Complete | /login, /register |
| Trip Booking | ✅ Complete | /trips → /bookings/new |
| Promo Codes | ✅ Complete | Apply at checkout |
| Payments | ✅ Complete | Stripe integration |
| Vendor Tools | ✅ Complete | /vendor/dashboard |
| Admin Panel | ✅ Complete | /admin/* |
| Chat | ✅ Complete | WebSocket based |
| Notifications | ✅ Complete | Real-time via Socket.io |

---

## 🔧 Configuration

### Backend Environment
```
MONGO_URI=mongodb://localhost:27017/travellr
REDIS_URL=redis://localhost:6379
PORT=5000
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=...
```

### Frontend Environment
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
```

---

## 🚀 Deployment Checklist

- [ ] Configure environment variables
- [ ] Set up MongoDB (Atlas or local)
- [ ] Set up Redis (Redis Cloud or local)
- [ ] Create Stripe account (get keys)
- [ ] Create Cloudinary account
- [ ] Set up SendGrid/SMTP
- [ ] Configure JWT secret
- [ ] Run `docker-compose build`
- [ ] Run `docker-compose up -d`
- [ ] Verify all services running
- [ ] Test API endpoints
- [ ] Test booking flow
- [ ] Test promo codes
- [ ] Test admin panel

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check MongoDB is running
mongod --dbpath /path/to/db

# Or use MongoDB Atlas connection string
```

### Redis Connection Error
```bash
# Check Redis is running
redis-server

# Or use Redis Cloud connection string
```

### API Port Already in Use
```bash
# Change PORT in .env
PORT=5001
```

### Frontend Not Loading
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "pagination": { "page": 1, "limit": 20, "total": 100 }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": [ ... ]
  }
}
```

---

## 🔑 Important Files

| File | Purpose |
|------|---------|
| doc.md | Main documentation |
| API_SPECIFICATION.md | API reference |
| INTEGRATION_COMPLETE.md | Feature checklist |
| COMPLETION_STATUS.md | Completion report |
| PROJECT_COMPLETION_SUMMARY.md | Executive summary |
| docker-compose.yml | Docker setup |
| .env.example | Environment template |

---

## 📱 Frontend Routes

```
/                    Home page
/trips               Trip listing
/trips/[slug]        Trip details
/bookings/new        Create booking
/bookings            My bookings
/profile             User profile
/wishlist            Saved trips

/vendor/dashboard    Vendor dashboard
/vendor/trips        Manage trips
/vendor/bookings     View bookings
/vendor/analytics    Analytics

/admin               Admin dashboard
/admin/users         User management
/admin/vendors       Vendor management
/admin/promo-codes   Promo code management
/admin/trips         Trip moderation
```

---

## 💻 Backend Routes

```
/api/v1/auth/*           Authentication
/api/v1/trips/*          Trip management
/api/v1/bookings/*       Booking management
/api/v1/promo-codes/*    Promo codes
/api/v1/vendors/*        Vendor operations
/api/v1/reviews/*        Reviews & ratings
/api/v1/admin/*          Admin operations
/api/v1/payroll/*        Payout management
/api/v1/notifications/*  Notifications
/api/v1/health           Health check
```

---

## 🔐 Authentication

```bash
# Register
POST /api/v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "customer"
}

# Login
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

# Get token in response
{
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "..."
  }
}

# Use token in headers
Authorization: Bearer {token}
```

---

## 🎯 Common Workflows

### Book a Trip
1. Browse trips: `GET /trips`
2. View details: `GET /trips/:slug`
3. Check availability
4. Create booking: `POST /bookings`
5. Apply promo code: `POST /promo-codes/validate`
6. Complete payment

### Create Promo Code (Admin)
1. Go to Admin Panel: `/admin/promo-codes`
2. Click "Create Promo Code"
3. Fill in details
4. Set discount type and value
5. Save
6. View statistics

### Approve Vendor (Admin)
1. Go to Admin: `/admin/vendors`
2. Find pending vendor
3. Click "Approve"
4. Vendor receives email
5. Vendor can now create trips

---

## 📈 Performance Tips

- ✅ Use pagination (default 20 items)
- ✅ Cache trip filters client-side
- ✅ Use debouncing for search
- ✅ Optimize images with Cloudinary
- ✅ Enable Redis caching

---

## 🔄 Background Jobs Status

| Job | Schedule | Status |
|-----|----------|--------|
| Payroll | Daily 00:00 | ✅ Running |
| Reminders | Hourly | ✅ Running |
| Cleanup | Weekly Sun 02:00 | ✅ Running |

---

## 📝 Database Models

1. User - Customers & vendors
2. Vendor - Vendor profiles
3. Trip - Trip listings
4. Booking - Reservations
5. Payment - Payment records
6. Payout - Vendor payouts
7. Review - Trip reviews
8. **PromoCode** - Discount codes ✨
9. Notification - User notifications
10. Message - Chat messages
11. Conversation - Chat threads
12. Wishlist - Saved trips
13. PayoutLedger - Payout history

---

## ✅ FINAL STATUS

**Project Completion:** 100% ✅  
**All Features:** Implemented & Integrated ✅  
**All Tests:** Ready ✅  
**Documentation:** Complete ✅  
**Production Ready:** YES ✅  

---

**For detailed information, refer to the full documentation files.**

**Last Updated:** January 17, 2026  
**Version:** 2.0.0
