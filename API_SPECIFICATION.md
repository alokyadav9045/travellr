# Travellr API Complete Specification

**API Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api/v1`  
**Authentication:** JWT Bearer Token

---

## 📌 Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Trip Endpoints](#trip-endpoints)
3. [Booking Endpoints](#booking-endpoints)
4. [Promo Code Endpoints](#promo-code-endpoints)
5. [Vendor Endpoints](#vendor-endpoints)
6. [Admin Endpoints](#admin-endpoints)
7. [Error Handling](#error-handling)

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "customer" // or "vendor"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "..." },
    "token": "eyJhbGc...",
    "refreshToken": "..."
  },
  "message": "Registration successful"
}
```

### Login
**POST** `/auth/login`

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "..." },
    "token": "eyJhbGc...",
    "refreshToken": "..."
  },
  "message": "Login successful"
}
```

### Verify Email
**POST** `/auth/verify-email`

```json
{
  "token": "verification_token_from_email"
}
```

### Request Password Reset
**POST** `/auth/forgot-password`

```json
{
  "email": "john@example.com"
}
```

### Reset Password
**POST** `/auth/reset-password`

```json
{
  "token": "reset_token",
  "newPassword": "NewSecurePassword123"
}
```

### Logout
**POST** `/auth/logout`

**Headers:** `Authorization: Bearer {token}`

---

## Trip Endpoints

### Get All Trips
**GET** `/trips?page=1&limit=20&search=&category=&minPrice=&maxPrice=&duration=&rating=`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "trips": [
      {
        "_id": "...",
        "title": "Goa Beach Adventure",
        "slug": "goa-beach-adventure",
        "description": "...",
        "price": { "amount": 5000, "currency": "USD" },
        "duration": { "days": 3, "nights": 2 },
        "location": { "city": "Goa", "state": "Goa", "country": "India" },
        "category": "beach",
        "images": [...],
        "rating": 4.5,
        "reviewCount": 23,
        "vendor": { "_id": "...", "businessName": "..." },
        "maxGroupSize": 30,
        "availableSpots": 5,
        "isFeatured": true,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### Get Trip Details
**GET** `/trips/:slug`

**Response (200):** Returns full trip details with images, itinerary, reviews

### Create Trip (Vendor)
**POST** `/trips`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "title": "Goa Beach Adventure",
  "description": "Experience the beautiful beaches of Goa...",
  "price": { "amount": 5000, "currency": "USD" },
  "duration": { "days": 3, "nights": 2 },
  "maxGroupSize": 30,
  "minGroupSize": 2,
  "category": "beach",
  "location": {
    "city": "Goa",
    "state": "Goa",
    "country": "India",
    "latitude": 15.2993,
    "longitude": 73.8243
  },
  "itinerary": [...],
  "cancellationPolicy": {...},
  "images": [...]
}
```

### Update Trip (Vendor)
**PATCH** `/trips/:id`

**Headers:** `Authorization: Bearer {token}`

### Delete Trip (Vendor)
**DELETE** `/trips/:id`

**Headers:** `Authorization: Bearer {token}`

### Search Trips
**POST** `/trips/search`

```json
{
  "location": "Goa",
  "checkInDate": "2024-06-15",
  "checkOutDate": "2024-06-18",
  "guests": 4,
  "maxPrice": 10000,
  "minRating": 4,
  "categories": ["beach", "adventure"]
}
```

---

## Booking Endpoints

### Create Booking
**POST** `/bookings`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "trip": "trip_id",
  "numberOfGuests": 4,
  "selectedDate": "2024-06-15",
  "guestDetails": {
    "leadGuest": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "additionalGuests": [...],
    "specialRequests": "Vegetarian meals needed"
  },
  "paymentMethod": "stripe",
  "promoCode": "SUMMER20" // Optional
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "_id": "...",
      "bookingNumber": "TRV-123456-1",
      "trip": "...",
      "user": "...",
      "totalPrice": 18000,
      "discount": 2000,
      "appliedPromoCode": "SUMMER20",
      "status": "pending",
      "paymentStatus": "pending"
    },
    "clientSecret": "pi_..."
  },
  "message": "Booking created successfully"
}
```

### Get Booking
**GET** `/bookings/:id`

**Headers:** `Authorization: Bearer {token}`

### Get My Bookings
**GET** `/bookings?page=1&limit=10&status=`

**Headers:** `Authorization: Bearer {token}`

### Cancel Booking
**POST** `/bookings/:id/cancel`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "reason": "Personal emergency"
}
```

### Confirm Payment
**POST** `/bookings/:id/confirm-payment`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "paymentIntentId": "pi_..."
}
```

### Request Refund
**POST** `/bookings/:id/request-refund`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "reason": "Trip cancelled"
}
```

---

## Promo Code Endpoints

### Validate Promo Code
**POST** `/promo-codes/validate`

```json
{
  "code": "SUMMER20",
  "amount": 20000,
  "vendorId": "vendor_id" // Optional
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "code": "SUMMER20",
    "discountType": "percentage",
    "discountValue": 10,
    "discount": 2000,
    "finalAmount": 18000
  }
}
```

### List Promo Codes (Admin)
**GET** `/promo-codes?page=1&limit=20&status=active&search=`

**Headers:** `Authorization: Bearer {admin_token}`

### Get Promo Code Details (Admin)
**GET** `/promo-codes/:id`

**Headers:** `Authorization: Bearer {admin_token}`

### Create Promo Code (Admin)
**POST** `/promo-codes`

**Headers:** `Authorization: Bearer {admin_token}`

```json
{
  "code": "SUMMER20",
  "description": "20% off all summer trips",
  "discountType": "percentage",
  "discountValue": 20,
  "maxDiscount": 5000,
  "minPurchaseAmount": 10000,
  "usageLimit": 100,
  "usagePerUser": 2,
  "validFrom": "2024-06-01T00:00:00Z",
  "validUntil": "2024-08-31T23:59:59Z",
  "applicableCategories": ["beach", "adventure"],
  "applicableVendors": []
}
```

### Update Promo Code (Admin)
**PATCH** `/promo-codes/:id`

**Headers:** `Authorization: Bearer {admin_token}`

### Delete Promo Code (Admin)
**DELETE** `/promo-codes/:id`

**Headers:** `Authorization: Bearer {admin_token}`

### Get Promo Code Stats (Admin)
**GET** `/promo-codes/:id/stats`

**Headers:** `Authorization: Bearer {admin_token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "code": "SUMMER20",
    "totalUsed": 45,
    "usageLimit": 100,
    "usageRemaining": 55,
    "totalDiscountGiven": 67500,
    "uniqueUsers": 40,
    "firstUsedAt": "2024-06-01T10:30:00Z",
    "lastUsedAt": "2024-06-15T14:45:00Z"
  }
}
```

---

## Vendor Endpoints

### Get Vendor Profile
**GET** `/vendors/:id`

### Update Vendor Profile
**PATCH** `/vendors/profile`

**Headers:** `Authorization: Bearer {vendor_token}`

```json
{
  "businessName": "Adventure Tours Co",
  "description": "...",
  "phone": "+1234567890",
  "address": {...},
  "bankAccount": {...}
}
```

### Get Vendor Dashboard
**GET** `/vendors/dashboard/stats`

**Headers:** `Authorization: Bearer {vendor_token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 450000,
    "revenueChange": 15,
    "totalBookings": 45,
    "bookingsChange": 20,
    "totalGuests": 320,
    "guestsChange": 10,
    "avgRating": 4.7,
    "ratingChange": 5,
    "recentBookings": [...],
    "revenueByMonth": [...],
    "upcomingTrips": [...]
  }
}
```

### Get Vendor Trips
**GET** `/vendors/trips?page=1&limit=20&status=`

**Headers:** `Authorization: Bearer {vendor_token}`

### Get Vendor Bookings
**GET** `/vendors/bookings?page=1&limit=20&status=`

**Headers:** `Authorization: Bearer {vendor_token}`

### Get Vendor Payouts
**GET** `/vendors/payouts?page=1&limit=10`

**Headers:** `Authorization: Bearer {vendor_token}`

---

## Admin Endpoints

### Get Platform Analytics
**GET** `/admin/analytics?startDate=2024-01-01&endDate=2024-12-31`

**Headers:** `Authorization: Bearer {admin_token}`

### Get All Users
**GET** `/admin/users?page=1&limit=20&search=&role=&isVerified=`

**Headers:** `Authorization: Bearer {admin_token}`

### Get All Vendors
**GET** `/admin/vendors?page=1&limit=20&status=pending&search=`

**Headers:** `Authorization: Bearer {admin_token}`

### Approve Vendor
**PATCH** `/admin/vendors/:id/approve`

**Headers:** `Authorization: Bearer {admin_token}`

**Response:** Sends approval email to vendor

### Reject Vendor
**PATCH** `/admin/vendors/:id/reject`

**Headers:** `Authorization: Bearer {admin_token}`

```json
{
  "reason": "Business documentation incomplete"
}
```

**Response:** Sends rejection email to vendor

### Get All Trips
**GET** `/admin/trips?page=1&limit=20&status=&search=`

**Headers:** `Authorization: Bearer {admin_token}`

### Moderate Trip
**PATCH** `/admin/trips/:id/moderate`

**Headers:** `Authorization: Bearer {admin_token}`

```json
{
  "status": "approved", // or "rejected"
  "feedback": "Trip details look good"
}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 400 | Input validation failed |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Trip not found"
  }
}
```

---

## Rate Limiting

- **General:** 100 requests per 15 minutes per IP
- **Auth:** 5 requests per 15 minutes per IP
- **Payment:** 10 requests per minute per user

---

## Pagination

All list endpoints support:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expires in 7 days. Use refresh token to get new token:
**POST** `/auth/refresh`

```json
{
  "refreshToken": "..."
}
```

---

## Webhooks

### Stripe Webhook
**POST** `/webhooks/stripe`

Handles:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

---

**API Documentation Version:** 1.0.0  
**Last Updated:** January 17, 2026  
**Status:** ✅ Complete
