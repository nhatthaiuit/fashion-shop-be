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
 *         description: A list of products
 */
router.get("/api/products", async (_req, res) => {
  try {
    const list = await Product.find({}).lean();
    return res.json(list);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Get product by id
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mongo ObjectId of a product
 *     responses:
 *       200:
 *         description: The product
 *       404:
 *         description: Not found
 */
router.get("/api/products/:id", async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id).lean();
    if (!prod) return res.status(404).json({ message: "Not found" });
    return res.json(prod);
  } catch (e) {
    return res.status(404).json({ message: "Not found" });
  }
});

/**
 * @openapi
 * /api/products/seed:
 *   post:
 *     summary: Seed demo products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Seed result
 */
router.post("/api/products/seed", async (_req, res) => {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    return res.json({ inserted: inserted.length });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

export default router;
