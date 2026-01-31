
# Base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies for build
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
# Copy prisma schema for runtime access if needed
COPY --from=builder /app/prisma ./prisma 

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
