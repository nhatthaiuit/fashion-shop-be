// src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import productRoutes from "./routes/productRoutes.js";

const app = express();
app.use(express.json());

// CORS
const allowed = (process.env.CORS_ORIGIN || "*").split(",").map(s => s.trim());
app.use(cors({
  origin: allowed.includes("*") ? true : allowed,
  credentials: true,
}));

// Health
app.get("/", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Fashion Shop API", version: "1.0.0" },
    servers: [
      { url: process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 5000}` },
    ],
  },
  apis: ["./src/routes/*.js"],
};
const swaggerSpec = swaggerJSDoc(options);
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
