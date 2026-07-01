# 🚀 Scalable Real-Time Chat Application

A production-style real-time chat application built with **Node.js**, **TypeScript**, **Hono**, **PostgreSQL**, **Prisma**, **Redis**, **Socket.IO**, **BullMQ**, and **AWS S3**.

The application is designed with scalability in mind, leveraging Redis Pub/Sub for distributed messaging, BullMQ for asynchronous processing, and PostgreSQL for reliable data persistence.

---

## ✨ Features

- 🔐 JWT Authentication & Refresh Tokens
- 👤 User Registration & Login
- 💬 One-to-One Messaging
- 👥 Group Chats
- ⚡ Real-Time Messaging with Socket.IO
- 🟢 Online/Offline User Presence
- 🏠 Socket.IO Rooms
- 📄 Cursor-Based Pagination
- ✏️ Edit & Delete Messages
- 🛡️ Message Ownership Validation
- 📎 Media Uploads (Images, Videos & Documents)
- ☁️ AWS S3 Integration
- 🚀 Redis Caching
- 📡 Redis Pub/Sub for Cross-Server Communication
- ⚙️ BullMQ Background Workers
- 🗄 PostgreSQL + Prisma ORM
- 📦 RESTful APIs
- 📝 Input Validation
- 🔒 Secure Authentication & Authorization

---

# 🏗️ Tech Stack

### Backend

- Node.js
- TypeScript
- Hono

### Database

- PostgreSQL
- Prisma ORM

### Realtime

- Socket.IO
- Redis Pub/Sub

### Queue

- BullMQ
- Redis

### Storage

- AWS S3

### Authentication

- JWT
- Refresh Tokens
- HTTP-only Cookies

---

# 📂 Project Structure

```text
src
│── controllers
│── routes
│── middleware
│── services
│── sockets
│── workers
│── queue
│── prisma
│── utils
│── types
└── index.ts
```

---

# ⚙️ System Architecture

```text
                Client
                   │
                   ▼
          Hono REST APIs
                   │
         JWT Authentication
                   │
      ┌────────────┴────────────┐
      │                         │
      ▼                         ▼
 Socket.IO Server          REST Endpoints
      │                         │
      └────────────┬────────────┘
                   │
             Redis Pub/Sub
                   │
      ┌────────────┴────────────┐
      │                         │
 BullMQ Workers         Online Users Cache
      │
      ▼
 PostgreSQL (Prisma ORM)
      │
      ▼
 AWS S3 (Media Storage)
```

---

# 🚀 Key Backend Concepts

- REST API Design
- JWT Authentication
- Refresh Token Rotation
- RBAC (Role-Based Authorization)
- Cursor-Based Pagination
- Redis Caching
- Redis Pub/Sub
- Background Job Processing
- Socket.IO Rooms
- Real-Time Communication
- AWS S3 File Storage
- Prisma ORM
- PostgreSQL Relationships
- Scalable Backend Architecture

---

# 📸 Core Functionalities

### Authentication

- User Registration
- Login
- Logout
- Refresh Token
- Protected Routes

---

### Chat

- One-to-One Chat
- Group Chat
- Typing Indicators
- Online Users
- Edit Message
- Delete Message
- Cursor Pagination

---

### Media

- Upload Images
- Upload Videos
- Upload Documents
- AWS S3 Storage

---

### Background Processing

BullMQ workers are used for:

- Asynchronous message persistence
- Background processing
- Improved response times
- Better scalability

---

### Redis

Redis is used for:

- Online user tracking
- Socket mapping
- Pub/Sub
- Caching
- Queue backend

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/bhushan-ai/Postgres-Pro.git
```

```bash
cd Postgres-Pro/chat-app
```

## Install dependencies

```bash
bun install
```

or

```bash
npm install
```

## Configure environment variables

Create a `.env` file.

```env
DATABASE_URL=

JWT_SECRET=

ACCESS_TOKEN_SECRET=

REFRESH_TOKEN_SECRET=

REDIS_URL=

AWS_ACCESS_KEY_ID=

AWS_SECRET_ACCESS_KEY=

AWS_REGION=

AWS_BUCKET_NAME=
```

## Run Prisma

```bash
bunx prisma migrate dev
```

```bash
bunx prisma generate
```

## Start Redis

```bash
docker compose up -d
```

## Run Worker

```bash
bun run src/services/worker.ts
```

## Start Development Server

```bash
bun run dev
```

---

# 🎯 Future Improvements

- Read Receipts
- Message Reactions
- Push Notifications
- Voice Messages
- End-to-End Encryption
- Kubernetes Deployment
- CI/CD Pipeline
- Monitoring & Logging
- Horizontal Scaling

---

# 👨‍💻 Author

**Bhushan Ingole**

- GitHub: https://github.com/bhushan-ai
- LinkedIn: https://www.linkedin.com/in/bhushan-ai
- Portfolio: https://bhushan-ai.netlify.app

---

⭐ If you found this project useful, consider giving it a **Star**.
