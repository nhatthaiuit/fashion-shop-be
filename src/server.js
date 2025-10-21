// src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger.js";

import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

/* ---------- MIDDLEWARE PHẢI ĐỨNG TRƯỚC ROUTES ---------- */
// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (đặt trước mọi routes)
const allowed = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map(s => s.trim());
// Cho phép mọi origin trong dev (tạm thời để chạy cho chắc)
app.use(cors({
  origin: true, // phản chiếu Origin header
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Origin','X-Requested-With','Content-Type','Accept','Authorization'],
  credentials: true,
}));

// Bắt và trả lời toàn bộ preflight (OPTIONS) theo chuẩn Express 5
app.options(/.*/, cors({
  origin: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Origin','X-Requested-With','Content-Type','Accept','Authorization'],
  credentials: true,
}));
/* ----------------------- ROUTES ------------------------- */
app.get("/", (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

// Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Static files (nếu cần)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "../images")));

/* --------------------- START SERVER --------------------- */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    const base = (process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, "");
    app.listen(PORT, () => {
      console.log("==============================================");
      console.log(`✅ MongoDB connected`);
      console.log(`✅ API listening on port ${PORT}`);
      console.log(`🔗 Health:        ${base}/`);
      console.log(`🔗 Swagger Docs:  ${base}/docs`);
      console.log(`🔗 Products:      ${base}/api/products`);
      console.log(`   (GET by id):   ${base}/api/products/{id}`);
      console.log(`🔗 Orders:        ${base}/api/orders`);
      console.log("==============================================");
    });
  })
  .catch((err) => {
    console.error("❌ Mongo connect error:", err?.message || err);
    process.exit(1);
  });

/* -------------------- ERROR HANDLERS -------------------- */
app.use(notFound);
app.use(errorHandler);


//ád
