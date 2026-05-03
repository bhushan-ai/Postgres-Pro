# 🚀 Postgres-Pro

A curated collection of backend projects built using **PostgreSQL, Prisma ORM, Docker, and TypeScript**.
This repository showcases practical implementations of database-driven applications with a focus on **scalability, clean architecture, and real-world backend patterns**.

---

## 📌 Overview

This repo contains multiple mini-projects demonstrating:

* 🧱 Relational database design (User, Post, Comment, etc.)
* ⚡ Prisma ORM with type-safe queries
* 🐳 Dockerized PostgreSQL setup
* 🔄 CRUD APIs with Express & TypeScript
* 📊 Efficient data handling & relations

---

## 📂 Projects Included

### 🔹 1. Social Media Backend

* User, Post, Comment system
* Relationships using Prisma ORM
* Comment count optimization
* REST API implementation

---

### 🔹 2. Prisma + PostgreSQL Basics

* Schema design
* Migrations & database setup
* CRUD operations

---

### 🔹 3. Dockerized PostgreSQL Setup

* PostgreSQL container using Docker
* Environment-based configuration
* Database persistence using volumes

---

## 🏗️ Tech Stack

* **Backend:** Node.js, Express, TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma
* **DevOps:** Docker
* **Tools:** Git, Postman

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository

```bash id="clone_repo"
git clone https://github.com/bhushan-ai/Postgres-Pro.git
cd Postgres-Pro
```

---

### 2️⃣ Install Dependencies

```bash id="install_deps"
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file:

```env id="env_file"
DATABASE_URL="postgresql://postgres:password@localhost:5432/basic_social_media"
```

---

### 4️⃣ Start PostgreSQL (Docker)

```bash id="docker_start"
docker compose up -d
```

---

### 5️⃣ Run Migrations

```bash id="migrate"
npx prisma migrate dev --name init
```

---

### 6️⃣ Start Development Server

```bash id="run_dev"
npm run dev
```

---

## 🧠 Key Learnings

* Designing relational schemas with Prisma
* Managing migrations and schema drift
* Using Docker for consistent database environments
* Handling real-world backend problems
* Writing clean, maintainable API logic

---

## 🚀 Future Enhancements

* 🔐 Authentication (JWT)
* ❤️ Like & Follow system
* 📊 Pagination & filtering
* 🌐 Deployment (Docker + Cloud)

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork and improve.

---

## 📧 Contact

* GitHub: https://github.com/bhushan-ai
* Email: [bhushaningole2004@gmail.com](mailto:bhushaningole2004@gmail.com)

---

⭐ If you found this useful, consider giving it a star!
