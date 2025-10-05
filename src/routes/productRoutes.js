import express from "express";
import Product from "../models/Product.js";
import products from "../data.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", async (req, res) => {
  try {
    const list = await Product.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Get product detail
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Create product (admin)
 *     tags: [Products]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, image, brand, category]
 *     responses:
 *       201: { description: Created }
 *       400: { description: Bad request }
 *       403: { description: Forbidden }
 */
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, price, image, brand, category, description, countInStock } = req.body;
    if (!name || price == null || !image || !brand || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const created = await Product.create({
      name, price, image, brand, category, description, countInStock
    });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * @openapi
 * /api/products/{id}:
 *   patch:
 *     summary: Update product (admin)
 *     tags: [Products]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.patch("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product (admin)
 *     tags: [Products]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * @openapi
 * /api/products/seed:
 *   post:
 *     summary: Seed sample products (dev only)
 *     tags: [Products]
 *     responses:
 *       200: { description: Seeded count }
 *       403: { description: Forbidden in production }
 */
router.post("/seed", async (req, res) => {
  try {
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
