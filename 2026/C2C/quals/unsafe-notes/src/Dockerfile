# Build stage for app dependencies
FROM node:current-alpine AS app-builder
WORKDIR /app
COPY app/package*.json ./
RUN npm ci --only=production

# Build stage for bot dependencies  
FROM node:current-alpine AS bot-builder
WORKDIR /bot
COPY bot/package*.json ./
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
RUN npm ci --only=production

# Final runtime stage
FROM node:current-alpine AS runtime

# Cache APK packages
RUN --mount=type=cache,target=/var/cache/apk \
    apk update && apk add --no-cache \
    chromium \
    nss \
    curl \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    supervisor \
    nginx \
    bash

# Create directories
RUN mkdir -p /app /bot /var/log/supervisor

# Copy app files and dependencies
COPY app/ /app/
COPY --from=app-builder /app/node_modules /app/node_modules

# Copy bot files and dependencies
COPY bot/ /bot/
COPY --from=bot-builder /bot/node_modules /bot/node_modules

# Copy configuration files
COPY conf/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose ports
EXPOSE 80

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

ENV ADMIN_USERNAME="admin" \
    ADMIN_PASSWORD="0b1cb19513f76d75dcc528e073350fae529b92368c8f2a74015dde9e82d12713" \
    APP_URL="http://localhost/"

WORKDIR /app

# Start all services
CMD ["/docker-entrypoint.sh"]
