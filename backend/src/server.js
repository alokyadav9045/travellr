const http = require('http');
const createApp = require('./app');
const env = require('./config/env');
const { connectDB } = require('./config/database');
const { connectRedis, getRedis } = require('./config/redis');
const logger = require('./utils/logger');
const { cleanupCron } = require('./jobs/cleanupCron');
const { payrollCron } = require('./jobs/payrollCron');
const { reminderCron } = require('./jobs/reminderCron');

const start = async () => {
  try {
    // Add process error handlers
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', { reason, promise });
      process.exit(1);
    });

    // Connect to services
    await connectDB();
    const redis = connectRedis();
    // Use try/catch for redis connect to prevent crash
    try {
      if (redis && redis.connect) {
        await redis.connect().catch(err => {
          logger.warn('Redis connection failed on startup, will retry in background', { error: err.message });
        });
      }
    } catch (err) {
      logger.warn('Redis connection error', { error: err.message });
    }

    const app = createApp();
    const server = http.createServer(app);

    // Initialize cron jobs
    try {
      cleanupCron.start();
      logger.info('Cleanup cron job started');

      payrollCron.start();
      logger.info('Payroll cron job started');

      reminderCron.start();
      logger.info('Reminder cron job started');
    } catch (error) {
      logger.warn('Error initializing cron jobs', { error: error.message });
    }

    // Optionally setup Socket.IO
    const ioSetup = async () => {
      try {
        const { Server } = require('socket.io');
        const io = new Server(server, { cors: { origin: env.clientUrl } });
        io.on('connection', (socket) => {
          logger.info('Socket connected', { id: socket.id });
          socket.on('disconnect', () => logger.info('Socket disconnected', { id: socket.id }));
        });
      } catch (e) {
        logger.warn('Socket.IO not initialized', { reason: e.message });
      }
    };

    await ioSetup();

    server.listen(env.port, () => {
      logger.info(`${env.isProd ? 'Production' : 'Development'} server listening on port ${env.port}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down server...`);

      // Stop cron jobs
      try {
        cleanupCron.stop();
        payrollCron.stop();
        reminderCron.stop();
        logger.info('Cron jobs stopped');
      } catch (error) {
        logger.warn('Error stopping cron jobs', { error: error.message });
      }

      server.close(async () => {
        logger.info('HTTP server closed');
        try {
          await (await connectDB()).disconnect;
        } catch (err) {
          // ignore
        }
        try {
          const r = getRedis();
          if (r) await r.quit();
        } catch (err) {
          // ignore
        }
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

if (require.main === module) start();

module.exports = { start };
