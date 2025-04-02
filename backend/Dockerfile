# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY backend/ .

# Expose backend port
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
