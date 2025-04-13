# Define the builder stage
FROM node:18-alpine AS builder
# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Cppy all the files
COPY . .

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_d29ydGh5LXN0dWQtMjguY2xlcmsuYWNjb3VudHMuZGV2JA

# Build the Next.js app
RUN npm run build

# Use the official Node.js 18 image for the production stage
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app ./

# Install only production dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
