# Step 1: Build the app
FROM node:18 AS builder
WORKDIR /app

# Copy files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the app and build it
COPY . .
RUN npm run build

# Step 2: Run the app
FROM node:18-alpine
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
