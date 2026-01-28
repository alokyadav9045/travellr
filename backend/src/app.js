const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const env = require('./config/env');
const logger = require('./utils/logger');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const setupSwagger = require('./config/swagger');

const createApp = () => {
  const app = express();

  // Basic security and parsers
  app.use(helmet());
  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // HTTP request logging
  app.use(morgan('combined', { stream: logger.stream }));

  // Swagger API Documentation
  setupSwagger(app);

  // API routes
  app.use(`${env.apiPrefix}/${env.apiVersion}`, routes);

  // Health check
  app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

  // 404
  app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Not Found' });
  });

  // Error handler
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
