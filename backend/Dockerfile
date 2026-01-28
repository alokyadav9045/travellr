# Backend Dockerfile
FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Development stage
FROM base AS development
ENV NODE_ENV=development
RUN npm install
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
ENV NODE_ENV=production
EXPOSE 5000
CMD ["npm", "start"]
