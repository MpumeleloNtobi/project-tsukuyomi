# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . /app

ENV CLERK_SECRET_KEY=sk_test_Lo9YZO4TWhU0veJ5K5L71oYYLJM8nrVNrOo2QhWHv8 \
    DATABASE_URL='postgresql://neondb_owner:npg_ZUgQeMX64rTm@ep-dry-term-a8pxk2za-pooler.eastus2.azure.neon.tech/neondb?sslmode=require' \
    AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=sdprojectimages2;AccountKey=qHRtSO+ps2HhYxj7rkxVWPEzhrLdp7COvSKWEniDcrSggTbFeg3iiNJyQyA6+jtbEK6NSy3zifYE+ASthH7ztQ==;EndpointSuffix=core.windows.net" \
    AZURE_CONTAINER='product-images' \
    STITCH_CLIENT_KEY=test-bfd0ab2c-0258-4973-8f4c-06e0e0ad97a3 \
    STITCH_CLIENT_SECRET=PQZn85k9I2P2DqbhifL0h3C0VhLLJhaXWimS6JAmqGWw3AixZ54f0nR1reGL6J/2
# Expose backend port
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
