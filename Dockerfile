# Use lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (cache optimization)
COPY package*.json ./

# Install ALL dependencies (needed for build)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript → JavaScript
RUN npm run build

# Install only production dependencies
RUN npm prune  --production


# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "dist/server.js"]