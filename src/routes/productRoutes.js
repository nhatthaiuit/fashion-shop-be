import express from "express";
import Product from "../models/Product.js";
import products from "../data.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: List products with pagination, filters, sort, and search
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 12 }
 *       - in: query
 *         name: q
 * 
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: priceMin
 *         schema: { type: number, minimum: 0 }
 *       - in: query
 *         name: priceMax
 *         schema: { type: number, minimum: 0 }
 *       - in: query
 *         name: sort
 *         description: |
 *           One of:
 *           - newest (default)
 *           - price_asc
 *           - price_desc
 *           - name_asc 
 *           - name_desc
 *           - rating_desc
 *         schema: { type: string, enum: [newest, price_asc, price_desc, rating_desc] }
 *     responses:
 *       200:
 *         description: Paginated product list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                     totalPages: { type: integer }
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string }
 *                       product_name: { type: string }
 *                       price: { type: number }
 *                       count_in_stock: { type: number }
 *                       created_at: { type: string, format: date-time }
 */
router.get("/", async (req, res) => {
  try {
    // Pagination
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 100);
    const skip = (page - 1) * limit;

    // Filters
    const { category, q } = req.query;
    const priceMin = req.query.priceMin != null ? Number(req.query.priceMin) : undefined;
    const priceMax = req.query.priceMax != null ? Number(req.query.priceMax) : undefined;

    const filter = {};
    if (category) filter.category = category;
    if (priceMin != null || priceMax != null) {
      filter.price = {};
      if (priceMin != null) filter.price.$gte = priceMin;
      if (priceMax != null) filter.price.$lte = priceMax;
    }
    if (q) {
      // Text search (đã tạo index text trong Product.js)
      filter.$text = { $search: q };
    }

    // Sorting
    let sort = { created_at: -1 }; // newest
    const sortKey = req.query.sort;
    if (sortKey === "price_asc") sort = { price: 1, created_at: -1 };
    if (sortKey === "price_desc") sort = { price: -1, created_at: -1 };
    if (sortKey === "rating_desc") sort = { rating: -1, numReviews: -1, created_at: -1 };

    // Query + count
    const [items, total] = await Promise.all([
      q
        ? Product.find(filter, { score: { $meta: "textScore" } })
          .sort({ score: { $meta: "textScore" }, ...sort })
          .skip(skip)
          .limit(limit)
        : Product.find(filter).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
      items,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Get product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Mongo ObjectId of a product
 *     responses:
 *       200:
 *         description: The product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id: { type: string }
 *                 product_name: { type: string }
 *                 price: { type: number }
 *                 count_in_stock: { type: number }
 *                 created_at: { type: string, format: date-time }
 *       404: { description: Not found }
 */
router.get("/:id", async (req, res) => {
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
 *             required: [product_name, price, image, category]
 *             properties:
 *               product_name: { type: string }
 *               price: { type: number }
 *               image: { type: string }
 * 
 *               category: { type: string }
 *               description: { type: string }
 *               count_in_stock: { type: number }
 *               sizes: 
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     label: { type: string }
 *                     stock: { type: number }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Bad request }
 *       403: { description: Forbidden }
 */
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { product_name, price, image, category, description, count_in_stock, sizes } = req.body;
    if (!product_name || price == null || !image || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const created = await Product.create({
      product_name, price, image, category, description, count_in_stock, sizes
    });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     summary: Update product (admin)
 *     tags: [Products]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name: { type: string }
 *               price: { type: number }
 *               image: { type: string }
 *               category: { type: string }
 *               description: { type: string }
 *               count_in_stock: { type: number }
 *               sizes: 
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     label: { type: string }
 *                     stock: { type: number }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update fields
    Object.assign(product, req.body);

    // Save triggers hooks (re-calc stock, status)
    const updated = await product.save();
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
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: Seeded count }
 */
router.post("/seed", protect, adminOnly, async (_req, res) => {
  try {
    const count = await Product.countDocuments();
    // Only allow seed if empty or force (optional logic, but basic auth is key)
    // For now just protect it.
    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    return res.json({ inserted: inserted.length });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

export default router;
