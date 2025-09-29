// src/routes/productRoutes.js
import express from "express";
import Product from "../models/Product.js";
import products from "../data.js";

const router = express.Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", async (req, res) => {
  try {
    const list = await Product.find();
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * @openapi
 * /api/products/seed:
 *   post:
 *     summary: Seed sample products (dev only)
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Seeded count
 *       403:
 *         description: Forbidden in production
 */
router.post("/seed", async (req, res) => {
  try {
    // 👉 Bật chặn ở production nếu muốn an toàn
    // if (process.env.NODE_ENV === "production") {
    //   return res.status(403).json({ message: "Seeding is disabled in production" });
    // }

    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    res.json({ inserted: inserted.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
