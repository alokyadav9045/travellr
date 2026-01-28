const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const env = require('../config/env');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  })
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} ${level}: ${message}`;
    if (Object.keys(meta).length > 0 && env.isDev) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    return log;
  })
);

const transports = [
  new winston.transports.Console({ format: consoleFormat }),
];

if (!env.isTest) {
  const logDir = path.join(__dirname, `../../${env.logging.dir}`);

  transports.push(
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d',
      format: logFormat,
    }),
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: logFormat,
    })
  );
}

const logger = winston.createLogger({
  level: env.logging.level,
  format: logFormat,
  transports,
  exceptionHandlers: env.isTest ? [] : [
    new DailyRotateFile({
      filename: path.join(__dirname, `../../${env.logging.dir}/exceptions-%DATE%.log`),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
    }),
  ],
  rejectionHandlers: env.isTest ? [] : [
    new DailyRotateFile({
      filename: path.join(__dirname, `../../${env.logging.dir}/rejections-%DATE%.log`),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
    }),
  ],
});

logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

module.exports = logger;
