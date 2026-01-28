const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Travellr API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Travellr travel booking platform',
      contact: {
        name: 'Travellr Support',
        email: 'support@travellr.com',
        url: 'https://travellr.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.travellr.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            role: { type: 'string', enum: ['customer', 'vendor', 'admin'], example: 'customer' },
            phone: { type: 'string', example: '+1234567890' },
            avatar: { type: 'string', format: 'uri' },
            isVerified: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Trip: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string', example: 'Mountain Adventure Trek' },
            slug: { type: 'string', example: 'mountain-adventure-trek' },
            description: { type: 'string' },
            category: { type: 'string', enum: ['adventure', 'cultural', 'wildlife', 'beach', 'mountain', 'city'] },
            location: {
              type: 'object',
              properties: {
                country: { type: 'string' },
                city: { type: 'string' },
                address: { type: 'string' },
                coordinates: {
                  type: 'object',
                  properties: {
                    latitude: { type: 'number' },
                    longitude: { type: 'number' },
                  },
                },
              },
            },
            pricing: {
              type: 'object',
              properties: {
                basePrice: { type: 'number', example: 299 },
                currency: { type: 'string', example: 'USD' },
                discountPercentage: { type: 'number', example: 10 },
              },
            },
            duration: {
              type: 'object',
              properties: {
                days: { type: 'number', example: 5 },
                nights: { type: 'number', example: 4 },
              },
            },
            images: { type: 'array', items: { type: 'string', format: 'uri' } },
            averageRating: { type: 'number', example: 4.5 },
            totalReviews: { type: 'number', example: 42 },
            status: { type: 'string', enum: ['draft', 'active', 'inactive'], example: 'active' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            bookingNumber: { type: 'string', example: 'TRV-2024-001234' },
            customer: { $ref: '#/components/schemas/User' },
            trip: { $ref: '#/components/schemas/Trip' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            travelers: { type: 'number', example: 2 },
            totalAmount: { type: 'number', example: 598 },
            status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'completed'] },
            paymentStatus: { type: 'string', enum: ['pending', 'completed', 'failed', 'refunded'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            error: { type: 'string' },
            stack: { type: 'string' },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        NotFoundError: {
          description: 'The requested resource was not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Trips', description: 'Trip management' },
      { name: 'Bookings', description: 'Booking management' },
      { name: 'Vendors', description: 'Vendor operations' },
      { name: 'Reviews', description: 'Review system' },
      { name: 'Wishlist', description: 'Wishlist management' },
      { name: 'Admin', description: 'Admin operations' },
      { name: 'Notifications', description: 'Notification system' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Travellr API Docs',
    })
  );

  // Serve swagger JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('📚 Swagger documentation available at /api-docs');
};

module.exports = setupSwagger;
