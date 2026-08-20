# 🛍️ Fashion Shop E-Commerce - Backend API

![Node.js](https://img.shields.io/badge/Node.js-v18+-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-5.x-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-%2385EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-Secure%20Auth-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

A production-ready Node.js/Express RESTful API powering the Fashion Shop E-Commerce platform. Engineered with a layered MVC architecture, robust role-based access control (RBAC), automated stock calculation, and Cloudinary media management.

---

## 🌐 Live API & Interactive Documentation

- **Base API URL**: [https://fashion-shop-backend.onrender.com](https://fashion-shop-backend.onrender.com)
- **Interactive Swagger UI**: [https://fashion-shop-backend.onrender.com/docs](https://fashion-shop-backend.onrender.com/docs)
- **Frontend Web Application**: [https://fashion-shop-frontend-uit.vercel.app](https://fashion-shop-frontend-uit.vercel.app)

### 🔐 Demo Credentials (For Testing & Recruitment)

| Role | Username / Email | Password |
| :--- | :--- | :--- |
| **Admin** | `newadmin` *(or `admin@fashionshop.com`)* | `NewAdmin@2024` *(or `123456`)* |
| **Customer** | Register freely via `/api/auth/register` | Custom |

---

## 🚀 Key Features & Highlights

- **Role-Based Access Control (RBAC)**: Secure authentication with JSON Web Tokens (JWT) and Bcrypt password hashing, separating customer and administrator capabilities.
- **Automated Stock Derivation**: Built-in Mongoose pre-save middleware that dynamically computes total `count_in_stock` from nested size variants (`S`, `M`, `L`, `XL`).
- **Cloudinary Media Upload**: Direct multipart file upload integration with Cloudinary for product catalog images.
- **Advanced Querying & Pagination**: Standardized pagination (`page`, `limit`, `skip`), sorting, and multi-field search (e.g. order status, customer name).
- **Data Export & Reporting**: Endpoints formatted for seamless CSV/Excel data export in the React-Admin dashboard.
- **Security Best Practices**: Integrated `helmet` headers, CORS whitelisting, MongoDB query sanitization, and structured global error handling.

---

## 🛠 Tech Stack & Dependencies

- **Core Runtime**: Node.js (ES Modules)
- **Framework**: Express.js (v5)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: `jsonwebtoken`, `bcrypt`
- **File Storage**: `multer`, `multer-storage-cloudinary`, `cloudinary`
- **API Documentation**: `swagger-jsdoc`, `swagger-ui-express`
- **Security & Utilities**: `helmet`, `cors`, `morgan`, `dotenv`

---

## 🗄️ Database Schema & Data Models

- **`User`**: Manages customer profiles, administrative accounts, role levels (`customer` | `admin`), and encrypted credentials.
- **`Product`**: Stores product details, pricing, discount rates, categorization, image URLs, and dynamic `sizes` stock arrays.
- **`Order`**: Tracks customer orders, line items, populated product snapshots, total amounts, shipping addresses, and lifecycle statuses (`pending`, `processing`, `shipped`, `completed`, `cancelled`).
- **`Category`**: Organizes products into intuitive taxonomy hierarchies.

---

## 💻 Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nhatthaiuit/fashion-shop-be.git
   cd fashion-shop-be
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Fill in your local credentials:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/fashionshop
   PUBLIC_BASE_URL=http://localhost:5000
   CORS_ORIGIN=http://localhost:5173
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Seed Initial Data (Optional)**:
   ```bash
   node src/seeder.js
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Server will start at `http://localhost:5000` with Swagger docs at `http://localhost:5000/docs`.

---

## 📁 Project Structure

```
fashion-shop-be/
├── src/
│   ├── config/          # MongoDB & Cloudinary service configurations
│   ├── controllers/     # Request controllers (Auth, Products, Orders, Upload)
│   ├── middleware/      # Auth verification (protect, isAdmin), error handlers
│   ├── models/          # Mongoose schemas (User, Product, Order, Category)
│   ├── routes/          # Express route declarations
│   ├── swagger/         # OpenAPI/Swagger schema definitions
│   ├── utils/           # Helper functions & async handlers
│   ├── seeder.js        # Database initial seeder script
│   ├── app.js           # Express app instance setup
│   └── server.js        # Server bootstrap & port listener
├── docs/                # Architecture diagrams & API collections
├── .env.example         # Template environment variables
└── package.json
```

---

## 📄 License & Author

Developed by **Nhat Thai** for academic and recruitment portfolio showcase.  
Licensed under the [ISC License](LICENSE).
