// src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
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

// CORS
const allowed = (process.env.CORS_ORIGIN || "*").split(",").map(s => s.trim());
app.use(cors({
  origin: allowed.includes("*") ? true : allowed,
  credentials: true,
}));

// Health
app.get("/", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// ---- Swagger /docs ----
// Không hard-code localhost; khi deploy hãy set PUBLIC_BASE_URL = https://<your-be-domain>

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use(productRoutes);

// Static images (optional)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "../images")));

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
      console.log("==============================================");
    });
  })
  .catch((err) => {
    console.error("❌ Mongo connect error:", err?.message || err);
    process.exit(1);
  });

app.use(notFound);
app.use(errorHandler);
