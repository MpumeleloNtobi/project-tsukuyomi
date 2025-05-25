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

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_d29ydGh5LXN0dWQtMjguY2xlcmsuYWNjb3VudHMuZGV2JA \
    CLERK_SECRET_KEY=sk_test_Lo9YZO4TWhU0veJ5K5L71oYYLJM8nrVNrOo2QhWHv8 \
    NEXT_PUBLIC_CLERK_SECRET_KEY=sk_test_Lo9YZO4TWhU0veJ5K5L71oYYLJM8nrVNrOo2QhWHv8 \
    NEXT_PUBLIC_BACKEND_URL='https://qa-backend-storify.calmcoast-a309bc31.eastus.azurecontainerapps.io'\
    NEXT_PUBLIC_GOOGLE_API_KEY='AIzaSyA7Q0ZQH8zHu5Nnuk1V2vF1ipcrag8nGSQ' \
    NEXT_PUBLIC_STITCH_ROOT_URL='https://express.stitch.money/api/v1/' \
    NEXT_PUBLIC_PAYMENT_REDIRECT_URL='https://qa-frontend-storify--0000013.calmcoast-a309bc31.eastus.azurecontainerapps.io/orders'

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
