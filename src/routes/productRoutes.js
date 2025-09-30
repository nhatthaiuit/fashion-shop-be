// src/routes/productRoutes.js
import express from "express";
import Product from "../models/Product.js";
import products from "../data.js";
import { requireAuth } from "../middlewares/auth.js";


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
 * /api/products/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A product
 *       404:
 *         description: Not found
 */
router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Create product (chỉ admin)
router.post("/", requireAuth(["admin"]), async (req, res) => {
  try {
    const { name } = req.body;
    const doc = await Product.create({ ...req.body, slug: slugify(name, { lower: true }) });
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Update (chỉ admin)
router.patch("/:id", requireAuth(["admin"]), async (req, res) => {
  try {
    const doc = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Delete (chỉ admin)
router.delete("/:id", requireAuth(["admin"]), async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});



export default router;
