# 🛍️ Fashion Shop - Backend API

![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

A robust Node.js/Express REST API powering the Fashion Shop E-Commerce platform.

## 📖 BA & System Documentation
For detailed system architecture, **Data Dictionary**, **State Machine Diagrams**, and full project descriptions, please visit our **[Notion Workspace](#)** *(Link to be updated)*.

## 🌐 Live API & Documentation
- **Base Endpoint**: **[https://fashion-shop-backend.onrender.com/](https://fashion-shop-backend.onrender.com/)**
- **Swagger API Docs**: **[https://fashion-shop-backend.onrender.com/docs](https://fashion-shop-backend.onrender.com/docs)**

### 🔐 Test Accounts (For Recruiters/Testers)
- **Admin**: `admin@fashionshop.com` / `123456`
- **Customer**: Feel free to register a new account via the `/api/auth/register` API.

## 🚀 Key Features

- **Automated Stock Derivation**: Built-in Mongoose Pre-save/Validate hooks that automatically calculate and enforce total `count_in_stock` based on dynamic clothing `sizes` constraints.
- **Advanced Querying & Filtering**: Optimized Mongoose queries supporting dynamic filtering (status, customer name) for the React-Admin dashboard.
- **API Documentation**: Fully documented endpoints using Swagger (OpenAPI) for seamless frontend integration and technical validation.
- **JWT Authentication**: Secure Role-Based Access Control (RBAC) separating Admin operations from Customer browsing.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JSON Web Tokens (jsonwebtoken), bcrypt
- **API Docs**: swagger-jsdoc, swagger-ui-express

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
3. **Configure Environment**
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
