# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY frontend/sd-project/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY frontend/sd-project/ .

# Expose frontend port
EXPOSE 3000

# Build and start Next.js
CMD ["npm", "run", "dev"]
