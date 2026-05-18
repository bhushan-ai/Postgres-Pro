# FitCheck Ecommerce Backend

A production-ready Ecommerce Backend API built with Node.js, Express, TypeScript, Prisma, PostgreSQL, Docker, JWT Authentication, Razorpay Payments, and Cloudinary.

---

# Features

## Authentication
- User Registration
- User Login
- JWT Authentication
- Refresh Token Sessions
- Role-Based Authorization (USER / ADMIN)

---

## Product Management
- Add Product
- Update Product
- Delete Product
- Get All Products
- Search Products
- Pagination
- Product Reviews

---

## Category Management
- Create Category
- Update Category
- Delete Category
- Slug Support

---

## Cart System
- Add To Cart
- Update Cart Quantity
- Remove Cart Items
- Calculate Total Price

---

## Order System
- Create Order
- Get User Orders
- Get Single Order
- Admin Order Status Update
- Stock Reduction After Order

---

## Payment Integration
- Razorpay Payment Order Creation
- Payment Verification
- Payment Status Management

---

## Address Management
- Add Customer Address

---

## Email System
- Welcome Email
- Order Confirmation Email

---

# Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- Razorpay
- Cloudinary
- Nodemailer
- Docker

---

# Project Structure

```bash
src/
│
├── controller/
├── middleware/
├── routes/
├── lib/
├── utils/
├── templates/
├── types/
│
├── server.ts
└── index.ts
```
---


# Deployment

The backend is containerized using Docker and deployed on Render with Supabase PostgreSQL as the production database.

---

## Deployment Stack

- Docker
- Render
- Supabase PostgreSQL
- Prisma ORM

---

# Docker Deployment

## Build Docker Image

```bash
docker build -t fitcheck-backend .