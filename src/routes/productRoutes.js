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
 *         description: Search by name/brand/category (text search)
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: brand
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
 *           - rating_desc
 *         schema: { type: string, enum: [newest, price_asc, price_desc, rating_desc] }
 *     responses:
 *       200: { description: Paginated product list }
 */
router.get("/", async (req, res) => {
  try {
    // Pagination
    const page  = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 100);
    const skip  = (page - 1) * limit;

    // Filters
    const { category, brand, q } = req.query;
    const priceMin = req.query.priceMin != null ? Number(req.query.priceMin) : undefined;
    const priceMax = req.query.priceMax != null ? Number(req.query.priceMax) : undefined;

    const filter = {};
    if (category) filter.category = category;
    if (brand)    filter.brand    = brand;
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
    let sort = { createdAt: -1 }; // newest
    const sortKey = req.query.sort;
    if (sortKey === "price_asc")   sort = { price: 1,  createdAt: -1 };
    if (sortKey === "price_desc")  sort = { price: -1, createdAt: -1 };
    if (sortKey === "rating_desc") sort = { rating: -1, numReviews: -1, createdAt: -1 };

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
 *       200: { description: The product }
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
 */
router.post("/seed", async (_req, res) => {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    return res.json({ inserted: inserted.length });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

export default router;
