// src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger.js";

import { notFound, errorHandler } from "./middleware/errorHandler.js";
// Routes
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);

app.use("/api/orders", orderRoutes);
// ---- Middleware cơ bản ----
app.use(express.json());

// CORS: cấu hình bằng biến ENV CORS_ORIGIN="https://your-fe.vercel.app,https://another.com"
// Dev thì có thể để "*"
const allowed =
  process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) || ["*"];
app.use(
  cors({
    origin: allowed.includes("*") ? true : allowed,
    credentials: true,
  })
);

// ---- Health check ----
app.get("/", (req, res) => {
  res.json({
    ok: true,
    name: "Fashion Shop API",
    time: new Date().toISOString(),
  });
});

// ---- Swagger /docs ----
// Không hard-code localhost; khi deploy hãy set PUBLIC_BASE_URL = https://<your-be-domain>

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ---- API routes ----
app.use("/api/products", productRoutes);

// ---- Kết nối DB rồi mới start server ----
const PORT = process.env.PORT || 5000;
const URI = process.env.MONGO_URI;

if (!URI) {
  console.error("❌ MONGO_URI is missing in environment variables.");
  process.exit(1);
}

mongoose
  .connect(URI, { serverSelectionTimeoutMS: 15000 })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      const base = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;
      console.log(`🚀 API base: ${base}`);
      console.log(`📘 Swagger: ${base.replace(/\/$/, "")}/docs`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err?.message || err);
    process.exit(1);
  });

app.use(notFound);
app.use(errorHandler);
