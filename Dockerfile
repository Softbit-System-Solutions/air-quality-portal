# ==============================
# 1️⃣ Build Stage
# ==============================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (for caching dependencies)
COPY package*.json ./
# If using yarn or pnpm, copy those instead
# COPY yarn.lock ./
# COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Next.js app
RUN npm run build


# ==============================
# 2️⃣ Run Stage
# ==============================
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy only required files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose Next.js default port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
