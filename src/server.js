// src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Swagger (tạo spec trực tiếp ở đây để /docs chạy public)
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

// Routes
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";



const app = express();

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
app.use("/api/auth", authRoutes);
// ---- Swagger /docs ----
// Không hard-code localhost; khi deploy hãy set PUBLIC_BASE_URL = https://<your-be-domain>
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Fashion Shop API", version: "1.0.0" },
    servers: [{ url: process.env.PUBLIC_BASE_URL || "/" }],
  },
  // Quét comment JSDoc ngay trong các file routes
  apis: ["./src/routes/*.js"],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
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


// 404
app.use((req,res)=> res.status(404).json({ message:"Not found" }));
// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next)=>{
  console.error(err);
  res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
});



// mount route vào server 
app.use("/api/categories", categoryRoutes);

