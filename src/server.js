// src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger.js";

import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

/* ---------- MIDDLEWARE PHẢI ĐỨNG TRƯỚC ROUTES ---------- */
// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection helper for standard and serverless environments
let isConnected = false;
export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI is missing in environment variables!");
    return;
  }
  await mongoose.connect(uri);
  isConnected = true;
};

// Ensure DB is connected for every request
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// CORS (đặt trước mọi routes)
app.use(cors({
  origin: true, // phản chiếu Origin header
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true,
}));

// Bắt và trả lời toàn bộ preflight (OPTIONS)
app.options(/.*/, cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true,
}));

/* ----------------------- ROUTES ------------------------- */
app.get("/", (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString(), message: "Fashion Shop API is running!" })
);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/upload", uploadRoutes);

// Swagger Documentation (with CDN assets for Vercel serverless compatibility)
const SWAGGER_CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css";
const SWAGGER_CUSTOM_CSS = `
  .swagger-ui .topbar { display: none }
  .swagger-ui .info { margin: 20px 0; }
  .swagger-ui .scheme-container { background: #fafafa; padding: 15px 0; }
`;

const swaggerUiOptions = {
  customCss: SWAGGER_CUSTOM_CSS,
  customSiteTitle: "Fashion Shop API Docs",
  customCssUrl: SWAGGER_CSS_URL,
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js"
  ]
};

// JSON spec endpoints
app.get(["/docs.json", "/api/docs.json", "/api-docs.json"], (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(swaggerSpec);
});

// Swagger UI on /docs and /api-docs
app.use(["/docs", "/api-docs"], swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

/* -------------------- ERROR HANDLERS -------------------- */
app.use(notFound);
app.use(errorHandler);

/* --------------------- START SERVER --------------------- */
const PORT = process.env.PORT || 4000;

if (process.env.VERCEL !== "1" && process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      const localUrl = `http://localhost:${PORT}`;
      app.listen(PORT, () => {
        console.log("==============================================");
        console.log(`✅ MongoDB connected`);
        console.log(`✅ API listening on port ${PORT}`);
        console.log("==============================================");
      });
    })
    .catch((err) => {
      console.error("❌ Mongo connect error:", err?.message || err);
    });
}

export default app;
