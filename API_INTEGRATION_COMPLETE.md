# API Integration Complete - Travellr Platform

## Overview
This document provides a comprehensive overview of all API endpoints implemented in the Travellr platform, including both backend routes and frontend API integrations.

## Backend API Endpoints

### 1. Authentication & Authorization (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| POST | `/refresh-token` | Refresh access token | No |
| POST | `/forgot-password` | Request password reset | No |
| POST | `/reset-password/:token` | Reset password with token | No |
| GET | `/verify-email/:token` | Verify email address | No |
| GET | `/me` | Get current user | Yes |
| POST | `/logout` | User logout | Yes |
| POST | `/resend-verification` | Resend verification email | Yes |
| PUT | `/update-password` | Update password | Yes |
| POST | `/google` | Google OAuth login | No |
| POST | `/facebook` | Facebook OAuth login | No |

### 2. Trips (`/api/v1/trips`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all trips with filters | No |
| GET | `/:slug` | Get trip by slug/ID | No |
| POST | `/` | Create new trip | Yes (Vendor) |
| PUT | `/:id` | Update trip | Yes (Vendor/Admin) |
| DELETE | `/:id` | Delete trip | Yes (Vendor/Admin) |
| POST | `/:id/images` | Upload trip images | Yes (Vendor) |
| DELETE | `/:id/images/:imageId` | Delete trip image | Yes (Vendor) |
| PATCH | `/:id/publish` | Publish trip | Yes (Vendor) |
| PATCH | `/:id/unpublish` | Unpublish trip | Yes (Vendor) |
| GET | `/:id/availability` | Check trip availability | No |
| GET | `/:id/similar` | Get similar trips | No |
| GET | `/:id/reviews` | Get trip reviews | No |

**Query Parameters for Trip Listing:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `q`: Search query
- `category`: Filter by category
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `minDuration`: Minimum duration in days
- `maxDuration`: Maximum duration in days
- `featured`: Filter featured trips (true/false)
- `sortBy`: Sort order (options: `price-asc`, `price-desc`, `rating`, `popular`, `newest`)

### 3. Bookings (`/api/v1/bookings`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new booking | Yes |
| GET | `/my-bookings` | Get user bookings | Yes |
| POST | `/:id/calculate-price` | Calculate booking price | Yes |
| GET | `/:id` | Get booking details | Yes |
| PATCH | `/:id` | Update booking | Yes |
| DELETE | `/:id` | Cancel booking | Yes |
| POST | `/:id/confirm-payment` | Confirm payment | Yes |
| POST | `/:id/request-refund` | Request refund | Yes |
| GET | `/:id/invoice` | Download invoice | Yes |
| POST | `/:id/message` | Send message | Yes |
| GET | `/:id/messages` | Get messages | Yes |

### 4. Vendors (`/api/v1/vendors`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all vendors | No |
| GET | `/:id` | Get vendor details | No |
| GET | `/:id/trips` | Get vendor trips | No |
| GET | `/:id/reviews` | Get vendor reviews | No |
| POST | `/` | Create vendor profile | Yes |
| PUT | `/:id` | Update vendor profile | Yes (Vendor) |
| GET | `/dashboard` | Get vendor dashboard | Yes (Vendor) |
| GET | `/bookings` | Get vendor bookings | Yes (Vendor) |
| GET | `/earnings` | Get vendor earnings | Yes (Vendor) |
| POST | `/stripe/account` | Create Stripe account | Yes (Vendor) |
| GET | `/stripe/account-link` | Get Stripe account link | Yes (Vendor) |
| GET | `/stripe/login-link` | Get Stripe login link | Yes (Vendor) |
| PATCH | `/:id/verify` | Verify vendor | Yes (Admin) |
| PATCH | `/:id/subscription` | Update subscription | Yes (Vendor) |

### 5. Reviews (`/api/v1/reviews`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/trip/:tripId` | Get trip reviews | No |
| POST | `/` | Create review | Yes |
| PUT | `/:id` | Update review | Yes |
| DELETE | `/:id` | Delete review | Yes |
| POST | `/:id/helpful` | Mark review helpful | Yes |

### 6. Wishlist (`/api/v1/wishlist`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user wishlist | Yes |
| POST | `/` | Add to wishlist | Yes |
| DELETE | `/:tripId` | Remove from wishlist | Yes |

### 7. Notifications (`/api/v1/notifications`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user notifications | Yes |
| GET | `/unread-count` | Get unread count | Yes |
| PATCH | `/:id/read` | Mark as read | Yes |
| PATCH | `/mark-all-read` | Mark all as read | Yes |
| DELETE | `/:id` | Delete notification | Yes |

### 8. Compare (`/api/v1/compare`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Compare trips | No |

### 9. Admin (`/api/v1/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard` | Admin dashboard stats | Yes (Admin) |
| GET | `/users` | List all users | Yes (Admin) |
| GET | `/trips` | List all trips | Yes (Admin) |
| GET | `/bookings` | List all bookings | Yes (Admin) |
| GET | `/vendors` | List all vendors | Yes (Admin) |
| PATCH | `/users/:id/status` | Update user status | Yes (Admin) |
| PATCH | `/trips/:id/status` | Update trip status | Yes (Admin) |
| PATCH | `/vendors/:id/verify` | Verify vendor | Yes (Admin) |

### 10. Payroll (`/api/v1/payroll`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get payroll records | Yes (Admin) |
| POST | `/process` | Process payroll | Yes (Admin) |
| GET | `/vendor/:vendorId` | Get vendor payouts | Yes (Vendor) |

### 11. Customer (`/api/v1/customers`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get customer profile | Yes |
| PUT | `/profile` | Update customer profile | Yes |
| GET | `/bookings` | Get customer bookings | Yes |
| GET | `/wishlist` | Get customer wishlist | Yes |

### 12. Webhooks (`/api/v1/webhooks`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/stripe` | Stripe webhook handler | No (Verified) |

## Frontend API Client

### File Structure

```
frontend/src/lib/api/
├── axios.ts           # API client configuration
├── auth.ts            # Authentication APIs
├── trips.ts           # Trip APIs
├── bookings.ts        # Booking APIs
├── vendorApi.ts       # Vendor APIs
├── reviewApi.ts       # Review APIs
├── wishlistApi.ts     # Wishlist APIs
├── notificationApi.ts # Notification APIs
├── compareApi.ts      # Compare APIs
├── customerApi.ts     # Customer APIs
├── adminApi.ts        # Admin APIs
├── payrollApi.ts      # Payroll APIs
├── promoCodeApi.ts    # Promo code APIs
└── index.ts           # Exports all APIs
```

### API Client Features

1. **Axios Configuration** (`axios.ts`)
   - Base URL configuration from environment variables
   - Request/response interceptors
   - Automatic token attachment
   - Error handling and retry logic
   - Token refresh on 401 errors

2. **Type Safety**
   - All API functions are fully typed with TypeScript
   - Request/response types defined in `@/types`
   - Compile-time validation

3. **Error Handling**
   - Centralized error handling
   - User-friendly error messages
   - Automatic retry for failed requests
   - Network error detection

4. **Authentication Flow**
   - Token storage in localStorage
   - Automatic token refresh
   - Logout on token expiration
   - OAuth integration (Google, Facebook)

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "metadata": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "stack": "..." // Only in development
}
```

## Authentication

### Token-Based Authentication
- JWT tokens used for authentication
- Access token expires in 15 minutes
- Refresh token expires in 7 days
- Tokens stored in localStorage

### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Rate Limiting

- Standard: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Implemented using Redis

## File Uploads

### Trip Images
- Endpoint: `POST /api/v1/trips/:id/images`
- Max files: 10
- Max size per file: 5MB
- Supported formats: jpg, jpeg, png, webp
- Storage: Cloudinary

### Profile Images
- Endpoint: `POST /api/v1/customers/profile/avatar`
- Max size: 2MB
- Supported formats: jpg, jpeg, png
- Storage: Cloudinary

## Pagination

All list endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response includes pagination metadata:
```json
{
  "data": [...],
  "metadata": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

## Filtering & Sorting

### Trip Filters
- **Category**: `adventure`, `cultural`, `religious`, `nature`, `beach`, `mountain`, `wildlife`, `heritage`, `wellness`, `other`
- **Price Range**: `minPrice`, `maxPrice`
- **Duration**: `minDuration`, `maxDuration`
- **Featured**: `featured=true`
- **Search**: `q` (full-text search)

### Trip Sorting
- `price-asc`: Price low to high
- `price-desc`: Price high to low
- `rating`: Highest rated first
- `popular`: Most booked first
- `newest`: Recently added first

## WebSocket Integration

### Connection
```javascript
const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
  auth: { token: accessToken }
});
```

### Events
- `notification:new` - New notification
- `booking:update` - Booking status update
- `message:new` - New message
- `trip:update` - Trip update

## Environment Variables

### Backend
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://...
REDIS_URL=redis://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
STRIPE_SECRET_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Frontend
```env
NEXT_PUBLIC_API_URL=https://api.travellr.com/api/v1
NEXT_PUBLIC_WS_URL=wss://api.travellr.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_FACEBOOK_APP_ID=...
```

## Testing

### API Testing Tools
- Postman collection available
- Automated tests using Jest
- Integration tests for critical flows

### Test Endpoints
```bash
# Health check
GET /api/v1/health

# API version
GET /api/v1/version
```

## Recent Updates (Latest Integration Work)

### 1. Trip Endpoints Enhanced
- ✅ Added `DELETE /trips/:id/images/:imageId` for deleting specific images
- ✅ Added `PATCH /trips/:id/publish` for publishing trips
- ✅ Added `PATCH /trips/:id/unpublish` for unpublishing trips
- ✅ Added `GET /trips/:id/availability` for checking availability
- ✅ Added `GET /trips/:id/similar` for similar trip recommendations
- ✅ Added `GET /trips/:id/reviews` for trip-specific reviews
- ✅ Enhanced trip listing with `featured` and `sortBy` filters
- ✅ Fixed sorting to use nested `stats.rating` and `stats.bookingsCount`

### 2. Booking Endpoints Fixed
- ✅ Moved calculate price from `POST /bookings/calculate` to `POST /bookings/:id/calculate-price`
- ✅ Frontend API updated to match new endpoint structure

### 3. Frontend API Updates
- ✅ Fixed `publishTrip` and `unpublishTrip` to use PATCH instead of PUT
- ✅ Updated `calculatePrice` to use correct endpoint with tripId parameter
- ✅ All frontend API functions now match backend routes exactly

### 4. Model Updates
- ✅ Added `bookingsCount` field to Trip model stats
- ✅ Preserved existing `isFeatured` field for featured trips

## API Documentation Access

- **Swagger UI**: `http://localhost:5000/api-docs`
- **Postman Collection**: Available in `/docs/postman/`
- **API Reference**: This document

## Support & Contact

For API support and questions:
- Email: dev@travellr.com
- Slack: #api-support
- Documentation: https://docs.travellr.com

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: ✅ All endpoints integrated and tested
