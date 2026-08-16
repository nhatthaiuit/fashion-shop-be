# 🛍️ Fashion Shop E-Commerce - Backend

![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

A robust Node.js/Express REST API powering the Fashion Shop E-Commerce platform.

## 📖 Comprehensive Documentation
For detailed system architecture, Database ERD (Entity Relationship Diagram), API Flowcharts, and full project descriptions, please visit our **[Notion Workspace](#)** *(Link to be updated soon)*.

## 🌐 Live API & Documentation
- **Base Endpoint**: **[https://fashion-shop-backend.onrender.com](https://fashion-shop-backend.onrender.com)**
- **Swagger API Docs**: **[https://fashion-shop-backend.onrender.com/docs](https://fashion-shop-backend.onrender.com/docs)**

### 🔐 Test Accounts (For Recruiters/Testers)
- **Admin**: `admin@fashionshop.com` / `123456`
- **Customer**: Feel free to register a new account via the `/api/auth/register` API.

## 🚀 Features

- **Automated Stock Derivation**: Built-in Mongoose Pre-save hooks that automatically calculate and enforce total `count_in_stock` based on clothing `sizes`.
- **Advanced Querying & Filtering**: Optimized Mongoose queries supporting dynamic order filtering (status, customer name) for the admin dashboard.
- **CSV Data Export**: API endpoints and structural support for seamless CSV export of orders and products.
- **JWT Authentication**: Role-based access control (Admin, Customer).

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JSON Web Tokens (jsonwebtoken), bcrypt
- **API Docs**: swagger-jsdoc, swagger-ui-express

## 🗄️ Database Schema

- `users`: Manages admin and customer credentials.
- `products`: Stores product details, categories, prices, and nested `sizes` arrays (stock tracking).
- `orders`: Core table tracking customer details, purchased items, total amount, shipping address, and delivery status.
- *(More tables will be updated soon)*

## 💻 Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/nhatthaiuit/fashion-shop-be.git
   cd fashion-shop-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Database & Environment**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/fashionshop
   PUBLIC_BASE_URL=http://localhost:5000
   CORS_ORIGIN=http://localhost:5173
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
.
├── src/
│   ├── config/      # Database connection configurations
│   ├── controllers/ # Request handlers (Auth, Products, Orders, etc.)
│   ├── middleware/  # Express middlewares (Auth, Error handling)
│   ├── models/      # Mongoose Schema Definitions
│   ├── routes/      # Express API routes definitions
│   └── server.js    # Application entry point & Swagger Setup
└── docs/            # Postman collections and API documentation
```
