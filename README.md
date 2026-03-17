# CareerSync Backend

The backend for CareerSync, a powerful and scalable job portal API. Built with Node.js, Express, and TypeScript, it provides a robust infrastructure for handling job applications, candidate matching, and real-time communication.

## 🚀 Key Features

- **Domain-Driven Architecture:** Modular structure for easier maintenance and scalability.
- **Role-Based Auth:** Secure authentication using JWT and Google OAuth via Passport.js.
- **Real-time Communication:** Integrated Chat and Notifications using Socket.io and Redis.
- **Database:** MongoDB for flexible data storage with Mongoose ODM.
- **Media Support:** File uploads handled via AWS S3 and Cloudinary.
- **Performance:** Caching and Pub/Sub mechanism powered by Redis.
- **Validation:** Type-safe request validation with Zod.
- **Email System:** Professional email handling with Nodemailer and SMTP integration.

## 🛠️ Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) / [Mongoose](https://mongoosejs.com/)
- **Cache & Pub/Sub:** [Redis](https://redis.io/)
- **Real-time:** [Socket.io](https://socket.io/)
- **Auth:** [Passport.js](https://www.passportjs.org/) / [JWT](https://jwt.io/)
- **Validation:** [Zod](https://zod.dev/)
- **Storage:** [AWS S3](https://aws.amazon.com/s3/) / [Cloudinary](https://cloudinary.com/)
- **Deployment:** [Docker](https://www.docker.com/) / [Vercel](https://vercel.com/)

## 🏁 Getting Started

### Prerequisites

- Node.js (v20+)
- MongoDB (Local or Atlas)
- Redis instance

### Installation

1. Navigate to the backend directory:
   ```bash
   cd career-sync-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (see below).

4. Build the project:
   ```bash
   npm run build
   ```

5. Start in development mode:
   ```bash
   npm run dev
   ```

## 🔐 Environment Variables

Create a `.env` file in the `career-sync-backend` directory and add the following:

```env
PORT=8000
MONGO_URI=your_mongodb_uri
ACCESS_JWT_SECRET=your_access_secret
REFRESH_JWT_SECRET=your_refresh_secret
NODE_ENV=development

# Mail Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email
MAIL_PASS=your_app_password

# Redis Configuration
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
CLIENT_URL=http://localhost:5173

# AWS Configuration (Optional)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your_bucket_name
```

## 📁 Project Structure

- `src/app.ts`: Express application setup and middleware integration.
- `src/server.ts`: Entry point for the HTTP & Socket.io server.
- `src/modules`: Domain-specific logic (Auth, Jobs, Applications, Chat, etc.).
- `src/middlewares`: Custom Express middlewares (Auth, Error handling, Rate limiting).
- `src/config`: Database and external service configurations.
- `src/websocket`: Socket.io event handlers and connection logic.
- `src/shared`: Generic utilities and constants.

## 📜 Available Scripts

- `npm run dev`: Starts the development server with hot-reload (`ts-node-dev`).
- `npm run start`: Starts the production server from `dist/`.
- `npm run build`: Compiles TypeScript to JavaScript.
- `npm run test`: Executes Jest test suites.
- `npm run lint`: Runs ESLint for code quality.
- `npm run format`: Formats code using Prettier.

## 🐳 Docker Support

Run with Docker Compose:
```bash
docker-compose up --build
```

---
Developed for CareerSync - Connecting talent with opportunities.
