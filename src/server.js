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

// Swagger (tùy bạn bật/tắt)
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Fashion Shop API", version: "1.0.0" },
    servers: [{ url: `http://localhost:${process.env.PORT || 5000}` }],
  },
  apis: [],
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api/products", productRoutes);

// ---- Connect DB rồi mới start server ----
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI; // mongodb+srv://...
if (!uri) {
  console.error("MONGO_URI is missing in .env");
  process.exit(1);
}

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 15000 })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
