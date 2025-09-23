import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get("/", (req, res) => res.send("Fashion Shop API is running"));

// Swagger
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Fashion Shop API", version: "1.0.0" },
    servers: [{ url: "http://localhost:" + (process.env.PORT || 5000) }],
  },
  apis: [],
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api/products", productRoutes);

// 👉 Start server TRƯỚC
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // 👉 Rồi mới connect DB (để /docs và / route vẫn sống nếu DB lỗi)
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is missing in .env");
    return;
  }
  mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 15000,
      // tls: true, // thường mặc định đã bật với mongodb+srv
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
});
