# Travellr - Travel Booking Platform 🌍✈️

A comprehensive B2B2C SaaS platform connecting travel vendors with customers. Built with modern technologies for scalability, performance, and exceptional user experience.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

## ⚡ Quick Start (Start Everything in One Command!)

### Windows, Mac, or Linux
```bash
# Start both Backend API & Frontend in one command
node scripts/start-both.js

# Then access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# API Docs: http://localhost:5000/api/v1/docs
```

**Test Credentials:**
```
Customer: john.wilson@example.com / SecurePass123!@
Vendor:   raj.adventuretravel@example.com / VendorPass123!@
Admin:    admin@travellr.com / AdminPass123!@
```

📖 **See [QUICK_STARTUP.md](./QUICK_STARTUP.md) for more startup options**

## 🚀 Features

### Customer Features
- **Advanced Search**: Full-text search with filters (category, location, price, duration, rating)
- **Smart Booking**: Multi-departure booking system with availability management
- **Secure Payments**: Stripe integration with saved payment methods
- **Trip Discovery**: Personalized recommendations and trending destinations
- **Reviews & Ratings**: Authentic reviews with photo uploads
- **Wishlist**: Save favorite trips for later
- **Real-time Notifications**: Booking updates via email, in-app, and push notifications
- **Recently Viewed**: Track and revisit recently browsed trips
- **Trip Comparison**: Compare up to 4 trips side-by-side

### Vendor Features
- **Dashboard Analytics**: Revenue trends, booking statistics, and performance metrics
- **Trip Management**: Create, edit, and manage trips with rich media
- **Booking Control**: Real-time booking management and traveler communication
- **Automated Payouts**: Stripe Connect integration for seamless payments
- **Revenue Reports**: Detailed financial analytics and export capabilities
- **Document Management**: Upload and verify business documents
- **Calendar Management**: Availability and departure scheduling

### Admin Features
- **Platform Analytics**: User growth, revenue, bookings, and vendor statistics
- **Vendor Approval**: Review and approve/reject vendor applications
- **Content Moderation**: Review management and trip approval workflow
- **User Management**: User roles, permissions, and account status
- **Payout Oversight**: Monitor and manage vendor payouts
- **System Health**: Performance monitoring and error tracking

## 📦 Tech Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Caching**: Redis
- **Authentication**: JWT + bcryptjs
- **Payments**: Stripe Connect
- **File Storage**: Cloudinary (images) + AWS S3 (documents)
- **Email**: Nodemailer with Handlebars templates
- **WebSocket**: Socket.io for real-time features
- **Job Scheduler**: node-cron for automated tasks
- **API Documentation**: Swagger/OpenAPI 3.0
- **Logging**: Winston with file rotation
- **Search**: MongoDB text search (Elasticsearch ready)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: Custom components + Radix UI primitives
- **State Management**: Redux Toolkit
- **Server State**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Animations**: Framer Motion
- **Payment UI**: Stripe Elements
- **PWA**: Service Worker + Web App Manifest
- **SEO**: Next.js Metadata API + Structured Data

### DevOps & Infrastructure
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (K8s) with HPA
- **Reverse Proxy**: Nginx with rate limiting
- **CI/CD**: GitHub Actions
- **Monitoring**: Winston logs + Health checks
- **Security**: Helmet.js, CORS, rate limiting

## 🛠️ Installation

### Prerequisites
- Node.js v18 or higher
- MongoDB (v5.0+)
- Redis (v7.0+) - optional but recommended
- Cloudinary account
- Stripe account
- AWS account (for S3)

### Quick Start with Docker (Recommended)

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/travellr.git
cd travellr
```

2. **Create environment files**:
```bash
cp .env.example .env
```

3. **Update environment variables** in `.env`

4. **Start all services**:
```bash
docker-compose up -d
```

5. **Access the application**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

### Manual Setup

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/travellr
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
REDIS_PORT=6379

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@travellr.com
```

5. Start development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Configure environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

5. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📝 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register           - Register new user
POST   /api/auth/login              - Login user
POST   /api/auth/logout             - Logout user
POST   /api/auth/refresh-token      - Refresh access token
GET    /api/auth/me                 - Get current user
POST   /api/auth/forgot-password    - Request password reset
POST   /api/auth/reset-password     - Reset password
POST   /api/auth/verify-email       - Verify email address
```

### Trip Endpoints
```
GET    /api/trips                   - List trips with filters
GET    /api/trips/search            - Search trips
GET    /api/trips/:slug             - Get trip by slug
GET    /api/trips/:id/reviews       - Get trip reviews
POST   /api/trips                   - Create trip (vendor)
PUT    /api/trips/:id               - Update trip (vendor)
DELETE /api/trips/:id               - Delete trip (vendor)
```

### Booking Endpoints
```
POST   /api/bookings                - Create booking
GET    /api/bookings/:id            - Get booking details
PUT    /api/bookings/:id/cancel     - Cancel booking
POST   /api/bookings/calculate      - Calculate booking price
```

For complete API documentation, see [doc.md](./doc.md)

## 🔧 Project Structure

### Backend
```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── jobs/            # Cron jobs
│   ├── websocket/       # Socket.io handlers
│   ├── utils/           # Utilities
│   ├── app.js           # Express app
│   └── server.js        # Entry point
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── app/             # Next.js pages (App Router)
│   ├── components/      # React components
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities & API client
│   ├── store/           # Redux store
│   ├── types/           # TypeScript types
│   └── styles/          # Global styles
└── package.json
```

## 🚦 Running in Production

### Backend
```bash
npm start
```

### Frontend
```bash
npm run build
npm start
```

## 🧪 Testing

### Backend Tests
```bash
npm test
```

### Frontend Tests
```bash
npm test
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting
- CORS protection
- XSS protection
- SQL injection prevention
- Helmet security headers
- Input validation with Zod
- Secure payment processing via Stripe

## 💳 Payment Flow

1. Customer selects trip and fills booking details
2. System creates payment intent via Stripe
3. Customer completes payment securely
4. Funds held in escrow until trip completion
5. Automatic payout to vendor after trip ends
6. Commission deducted before payout

## 📧 Email Notifications

- Welcome emails
- Email verification
- Booking confirmations
- Trip reminders
- Payment receipts
- Payout notifications
- Review requests

## 🔄 Background Jobs

- **Payroll Cron**: Processes vendor payouts daily/weekly
- **Reminder Cron**: Sends trip and payment reminders hourly
- **Cleanup Cron**: Cleans expired tokens and old data weekly

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@travellr.com or join our Slack channel.

## 🙏 Acknowledgments

- UI/UX inspired by Zostel
- Built with modern web technologies
- Stripe for payment processing
- Cloudinary for media management
- MongoDB Atlas for database hosting

---

Made with ❤️ by the Travellr Team
