# Railway Dockerfile for Node.js Backend
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm install

# Copy source code
COPY backend/ ./backend/
COPY shared/ ./shared/

# Build the application
RUN npm run build:backend
RUN npm run build:shared

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]