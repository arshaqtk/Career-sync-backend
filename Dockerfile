# 1️⃣ Base image
FROM node:20-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy dependency files first
COPY package*.json ./

# 4️⃣ Install ALL dependencies (needed for build)
RUN npm install

# 5️⃣ Copy source code
COPY . .

# 6️⃣ Build TypeScript → JavaScript
RUN npm run build

# 7️⃣ Remove dev dependencies (optimize image)
RUN npm prune --production

# 8️⃣ Expose port
EXPOSE 5000

# 9️⃣ Run compiled JS
CMD ["node", "dist/server.js"]
