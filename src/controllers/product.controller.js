// src/controllers/product.controller.js
import Product from "../models/Product.js";

/**
 * GET /api/products
 * Query:
 *  - q (text search), category, sale=true, minPrice, maxPrice
 *  - sort=createdAt:desc | price:asc | price:desc ...
 *  - page, limit
 */
export async function listProducts(req, res, next) {
  try {
    const {
      q,
      category,
      sale,
      minPrice,
      maxPrice,
      sort = "createdAt:desc",
      page = 1,
      limit = 12,
    } = req.query;

    const cond = {};
    if (category) cond.category = String(category).toUpperCase();
    if (sale === "true") {
      cond.$or = [{ salePrice: { $ne: null } }, { discount: { $gt: 0 } }];
    }
    if (minPrice || maxPrice) {
      cond.price = {};
      if (minPrice) cond.price.$gte = Number(minPrice);
      if (maxPrice) cond.price.$lte = Number(maxPrice);
    }
    if (q) cond.$text = { $search: q };

    const [field, dir] = String(sort).split(":");
    const sortObj = { [field]: dir === "asc" ? 1 : -1 };

    const p = Math.max(1, Number(page));
    const l = Math.max(1, Number(limit));
    const skip = (p - 1) * l;

    const [items, total] = await Promise.all([
      Product.find(cond).sort(sortObj).skip(skip).limit(l).lean(),
      Product.countDocuments(cond),
    ]);

    return res.json({
      success: true,
      data: items,
      pageInfo: { page: p, limit: l, total, pages: Math.max(1, Math.ceil(total / l)) },
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/products/:id */
export async function getProduct(req, res, next) {
  try {
    const doc = await Product.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, error: "NOT_FOUND" });
    return res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
}
