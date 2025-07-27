# Dockerfile for Frontend
# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code and scripts
COPY . .

# Set environment variables for build time
ARG VITE_API_BASE_URL=http://localhost:8000/api/v1
ARG VITE_API_TIMEOUT=30000
ARG VITE_APP_NAME="URL Analyzer"
ARG VITE_APP_VERSION=1.0.0
ARG VITE_AUTH_STORAGE_KEY=webAnalyzer_auth
ARG VITE_DEBUG_MODE=false
ARG VITE_ENABLE_ANALYTICS=true

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_TIMEOUT=${VITE_API_TIMEOUT}
ENV VITE_APP_NAME=${VITE_APP_NAME}
ENV VITE_APP_VERSION=${VITE_APP_VERSION}
ENV VITE_AUTH_STORAGE_KEY=${VITE_AUTH_STORAGE_KEY}
ENV VITE_DEBUG_MODE=${VITE_DEBUG_MODE}
ENV VITE_ENABLE_ANALYTICS=${VITE_ENABLE_ANALYTICS}

# Generate environment configuration file before build
RUN pnpm gen:env

# Build the application
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create nginx log directory
RUN mkdir -p /var/log/nginx

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
