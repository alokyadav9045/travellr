# API Endpoints Audit Report
**Generated:** January 28, 2026

---

## CRITICAL FINDINGS & ISSUES

### ✅ FIXED
1. **API Version Prefix** - Frontend now correctly uses `/api/v1` base URL

---

## 1. AUTHENTICATION ENDPOINTS

### Frontend: `authApi` (src/lib/api/auth.ts)
| Function | Endpoint | Method | Status |
|----------|----------|--------|--------|
| register | `/auth/register` | POST | ✅ |
| login | `/auth/login` | POST | ✅ |
| logout | `/auth/logout` | POST | ⚠️ No endpoint in backend |
| getCurrentUser | `/auth/me` | GET | ✅ |
| refreshToken | `/auth/refresh-token` | POST | ✅ |
| forgotPassword | `/auth/forgot-password` | POST | ✅ |
| resetPassword | `/auth/reset-password/:token` | POST | ✅ |
| verifyEmail | `/auth/verify-email/:token` | GET | ✅ |
| resendVerification | `/auth/resend-verification` | POST | ⚠️ No endpoint in backend |
| updatePassword | `/auth/update-password` | PUT | ⚠️ No endpoint in backend |
| googleLogin | `/auth/google` | POST | ⚠️ No endpoint in backend |
| facebookLogin | `/auth/facebook` | POST | ⚠️ No endpoint in backend |

### Backend Routes: authRoutes.js
```
POST   /register
POST   /login
POST   /refresh-token
POST   /forgot-password
POST   /reset-password/:token
GET    /verify-email/:token
GET    /me (protected)
POST   /logout (protected)
```

### Missing Backend Endpoints
- [ ] POST `/auth/logout` - Frontend expects this
- [ ] POST `/auth/resend-verification` - Frontend expects this
- [ ] PUT `/auth/update-password` - Frontend expects this
- [ ] POST `/auth/google` - Google OAuth
- [ ] POST `/auth/facebook` - Facebook OAuth

---

## 2. TRIPS ENDPOINTS

### Frontend: `tripApi` (src/lib/api/trips.ts)
| Function | Endpoint | Method | Status |
|----------|----------|--------|--------|
| searchTrips | `/trips` | GET | ✅ |
| getTrips | `/trips` | GET | ✅ |
| getTripBySlug | `/trips/:slug` | GET | ✅ |
| getTripById | `/trips/:id` | GET | ✅ |
| getFeaturedTrips | `/trips?featured=true` | GET | ⚠️ Check if param works |
| getPopularTrips | `/trips?sortBy=popularity` | GET | ⚠️ Check if param works |
| checkAvailability | `/trips/:tripId/availability` | GET | ⚠️ Unclear if implemented |
| getSimilarTrips | `/trips/:tripId/similar` | GET | ⚠️ Unclear if implemented |
| getTripReviews | `/trips/:tripId/reviews` | GET | ⚠️ May conflict with /reviews/:tripId |
| createTrip | `/trips` | POST | ✅ Protected |
| updateTrip | `/trips/:tripId` | PUT | ✅ Protected |
| deleteTrip | `/trips/:tripId` | DELETE | ✅ Protected |
| publishTrip | `/trips/:tripId/publish` | PUT | ⚠️ Unclear if implemented |
| unpublishTrip | `/trips/:tripId/unpublish` | PUT | ⚠️ Unclear if implemented |
| addDeparture | `/trips/:tripId/departures` | POST | ✅ Protected |
| uploadImages | `/trips/:tripId/images` | POST | ✅ Protected |
| deleteImage | `/trips/:tripId/images/:imageId` | DELETE | ✅ Protected |

### Backend Routes: tripRoutes.js
```
GET    /           (searchTrips)
GET    /:slug      (getTripBySlug/Id)
POST   /           (createTrip - protected)
PUT    /:id        (updateTrip - protected)
DELETE /:id        (deleteTrip - protected)
POST   /:id/images (uploadImages - protected)
```

### Missing Backend Endpoints
- [ ] GET `/trips?featured=true` - Need to verify query parameter support
- [ ] GET `/trips?sortBy=popularity` - Need to verify query parameter support
- [ ] GET `/trips/:tripId/availability` - Frontend expects this
- [ ] GET `/trips/:tripId/similar` - Frontend expects this
- [ ] GET `/trips/:tripId/reviews` - Frontend expects this
- [ ] PUT `/trips/:tripId/publish` - Frontend expects this
- [ ] PUT `/trips/:tripId/unpublish` - Frontend expects this
- [ ] DELETE `/trips/:tripId/images/:imageId` - Delete specific image

---

## 3. BOOKINGS ENDPOINTS

### Frontend: `bookingApi` (src/lib/api/bookings.ts)
| Function | Endpoint | Method | Status |
|----------|----------|--------|--------|
| createBooking | `/bookings` | POST | ✅ Protected |
| getBooking | `/bookings/:bookingId` | GET | ✅ Protected |
| getUserBookings | `/bookings/my-bookings` | GET | ⚠️ Check order - before /:id |
| getMyBookings | `/bookings/my-bookings` | GET | ✅ Protected |
| getBookingById | `/bookings/:id` | GET | ✅ Protected |
| updateBooking | `/bookings/:bookingId` | PUT | ⚠️ Check if PATCH or PUT |
| cancelBooking | `/bookings/:bookingId` | DELETE | ✅ Protected |
| calculatePrice | `/bookings/calculate` | POST | ⚠️ Not in backend routes |
| downloadInvoice | `/bookings/:bookingId/invoice` | GET | ⚠️ Not in backend routes |
| sendMessage | `/bookings/:bookingId/message` | POST | ⚠️ Not in backend routes |
| getMessages | `/bookings/:bookingId/messages` | GET | ⚠️ Not in backend routes |

### Backend Routes: bookingRoutes.js
```
POST   /                      (createBooking - protected)
GET    /my-bookings           (listForUser - protected)
GET    /:id                   (getBooking - protected)
PATCH  /:id                   (updateBooking - protected)
DELETE /:id                   (cancelBooking - protected)
POST   /:id/confirm-payment   (confirmPayment - protected)
POST   /:id/request-refund    (requestRefund - protected)
```

### Missing Backend Endpoints
- [ ] POST `/bookings/calculate` - Price calculation
- [ ] GET `/bookings/:bookingId/invoice` - Invoice download
- [ ] POST `/bookings/:bookingId/message` - Booking messages
- [ ] GET `/bookings/:bookingId/messages` - Get messages

### Method Mismatches
- ⚠️ Frontend uses `PUT` for updateBooking, backend uses `PATCH`

---

## 4. VENDOR ENDPOINTS

### Backend Routes: vendorRoutes.js
```
GET    /                        (listVendors)
GET    /:id                     (getVendor)
GET    /:id/trips               (getVendorTrips)
GET    /:id/reviews             (getVendorReviews)
POST   /                        (createVendor - protected)
PUT    /:id                     (updateVendor - protected)
GET    /:id/dashboard           (getDashboard - protected)
GET    /:id/bookings            (getBookings - protected)
GET    /:id/earnings            (getEarnings - protected)
POST   /:id/stripe-account      (createStripeAccount - protected)
GET    /:id/stripe-account-link (getStripeAccountLink - protected)
GET    /:id/stripe-login-link   (getStripeLoginLink - protected)
PATCH  /:id/verify              (verifyVendor - protected/admin)
PATCH  /:id/subscription        (updateSubscription - protected)
```

### Frontend: No dedicated vendorApi client
❌ **ISSUE:** Frontend has no API client for vendor endpoints. Need to create `vendorApi.ts`

---

## 5. REVIEWS ENDPOINTS

### Backend Routes: reviewRoutes.js
```
POST   /                   (createReview - protected)
GET    /trip/:tripId       (getForTrip)
GET    /vendor/:vendorId   (getForVendor)
GET    /:id                (getReview)
PUT    /:id                (updateReview - protected)
DELETE /:id                (deleteReview - protected)
GET    /:id/responses      (getResponses)
POST   /:id/responses      (addResponse - protected)
```

### Frontend: No dedicated reviewApi client
❌ **ISSUE:** Frontend has no API client for review endpoints. Need to create `reviewApi.ts`

---

## 6. WISHLIST ENDPOINTS

### Backend Routes: wishlistRoutes.js
```
GET    /                     (getWishlist - protected)
POST   /:tripId              (toggleWishlist - protected)
GET    /check/:tripId        (checkIfInWishlist - protected)
DELETE /:tripId              (removeFromWishlist - protected)
```

### Frontend: No dedicated wishlistApi client
❌ **ISSUE:** Frontend has no API client for wishlist endpoints. Need to create `wishlistApi.ts`

---

## 7. NOTIFICATIONS ENDPOINTS

### Backend Routes: notificationRoutes.js
Exists but not checked. Need to verify endpoints.

### Frontend: No dedicated notificationApi client
❌ **ISSUE:** Frontend has no API client for notification endpoints. Need to create `notificationApi.ts`

---

## 8. OTHER ENDPOINTS

### Backend Routes
- **adminRoutes.js** - Exists, not checked
- **compareRoutes.js** - Exists, not checked
- **payrollRoutes.js** - Exists, not checked
- **customerRoutes.js** - Exists, not checked
- **webhookRoutes.js** - Exists, not checked
- **promoCodeRoutes.js** - Exists, not checked

### Frontend: Missing API clients
❌ **adminApi.ts**
❌ **compareApi.ts**
❌ **payrollApi.ts**
❌ **customerApi.ts**
❌ **webhookApi.ts**
❌ **promoCodeApi.ts**
❌ **notificationApi.ts**

---

## SUMMARY OF ISSUES

### 🔴 CRITICAL (Blocking functionality)
1. **Method Mismatch** - Bookings updateBooking: Frontend PUT vs Backend PATCH
2. **Missing Backend Endpoints** - Bookings calculate, invoice, messages
3. **Missing Frontend Clients** - For 6+ modules (vendor, review, wishlist, notifications, etc.)

### 🟡 WARNINGS (Needs verification)
1. Trip query parameters (featured, sortBy) - Verify backend supports them
2. Trip endpoints (publish, unpublish, availability, similar, reviews) - Verify implementation
3. Auth endpoints (logout, resend-verification, updatePassword, OAuth) - Verify backend support
4. Route parameter ordering (my-bookings should come before /:id)

### ✅ WORKING
- Basic auth flow (register, login, refresh-token)
- Trip CRUD operations
- Basic booking operations
- Trip listing and retrieval

---

## RECOMMENDATIONS

### Priority 1: Fix Critical Issues
1. [ ] Change `/bookings/:id` to use PATCH instead of PUT in frontend
2. [ ] Add missing bookings endpoints to backend (calculate, invoice, messages)
3. [ ] Verify trip filter parameters work as expected

### Priority 2: Create Missing API Clients
1. [ ] Create `vendorApi.ts`
2. [ ] Create `reviewApi.ts`
3. [ ] Create `wishlistApi.ts`
4. [ ] Create `notificationApi.ts`
5. [ ] Create `adminApi.ts`
6. [ ] Create `promoCodeApi.ts`
7. [ ] Create `compareApi.ts`
8. [ ] Create `payrollApi.ts`

### Priority 3: Backend Verification
1. [ ] Verify OAuth endpoints (Google, Facebook)
2. [ ] Verify trip endpoints (publish, unpublish, availability, similar)
3. [ ] Verify all query parameter support
4. [ ] Add missing auth endpoints (logout, resend-verification, updatePassword)

---

## API BASE URL
**Current:** `http://localhost:5000/api/v1` ✅ (Fixed)

---

