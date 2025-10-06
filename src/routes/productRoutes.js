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
 *         description: A list of products
 */

router.get("/api/products", async (_req, res) => {
  try {
    const list = await Product.find({}).sort({ createdAt: -1 }).lean();
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
