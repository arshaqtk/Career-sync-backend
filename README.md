# CareerSync Backend

CareerSync is a comprehensive platform designed to bridge the gap between job seekers and recruiters. This backend serves as the core API, handling authentication, job management, candidate applications, real-time notifications, and messaging.

## 🚀 Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.ts](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Caching:** [Redis](https://redis.io/)
- **Real-time:** [Socket.io](https://socket.io/)
- **Authentication:** [Passport.js](https://www.passportjs.org/) (JWT & Google OAuth 2.0)
- **File Storage:** [Cloudinary](https://cloudinary.com/) / AWS S3
- **Validation:** [Zod](https://zod.dev/)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Redis (Optional but recommended for performance)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (see below).

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🔐 Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# Server Configuration
PORT=8000
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Secret Keys
ACCESS_JWT_SECRET=your_access_token_secret
REFRESH_JWT_SECRET=your_refresh_token_secret
JWT_EXPIRE=7d

# Email Configuration (Nodemailer)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM=CareerSync <noreply@careersync.com>

# Redis Configuration (Optional)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🔌 API Endpoints

| Base Path | Description |
|-----------|-------------|
| `/api/auth` | Authentication (Login, Register, OTP, Google OAuth) |
| `/api/user` | User Profile & Management |
| `/api/job` | Job Posting & Management |
| `/api/candidate` | Candidate Profile & Resume Management |
| `/api/recruiter` | Recruiter Dashboard & Management |
| `/api/application` | Job Application Workflow |
| `/api/interview` | Interview Scheduling & Status |
| `/api/admin` | Platform Administration |
| `/api/notifications` | Real-time & Stored Notifications |
| `/api/chat` | Messaging & Real-time Chat |
| `/api/companies` | Company Profile Management |

## 📜 Scripts

- `npm run dev`: Start development server with hot-reload.
- `npm run build`: Compile TypeScript to JavaScript.
- `npm start`: Run the compiled production server.
- `npm run lint`: Run ESLint to check for code issues.
- `npm run format`: Format code using Prettier.

---
Developed with ❤️ by the CareerSync Team.
