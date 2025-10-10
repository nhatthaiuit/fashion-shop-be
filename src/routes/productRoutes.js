// src/routes/productRoutes.js
import express from "express";
import Product from "../models/Product.js";
import products from "../data.js";
import { listProducts, getProduct } from "../controllers/product.controller.js";

const router = express.Router();

/** ✅ LIST + FILTER + PAGINATION:  GET /api/products */
router.get("/", listProducts);

/** ✅ DETAIL: GET /api/products/:id */
router.get("/:id", getProduct);

/** ✅ SEED: POST /api/products/seed  (nạp lại data mẫu) */
router.post("/seed", async (_req, res) => {
  try {
    const mapCategory = (c) => {
      const s = (c || "").toLowerCase();
      if (s.includes("shirt") || s.includes("top")) return "TOP";
      if (s.includes("pant") || s.includes("trouser") || s.includes("jean")) return "BOTTOM";
      if (s.includes("access")) return "ACCESSORIES";
      return "TOP";
    };

    const enriched = products.map((p, i) => {
      const discount = i % 3 === 0 ? 0.2 : 0; // 1/3 sản phẩm có sale 20%
      const salePrice = discount > 0 ? Math.round(p.price * (1 - discount)) : null;
      return {
        ...p,
        category: mapCategory(p.category),
        discount,
        salePrice,
        // Nếu data.js có image tương đối → fallback về ảnh default
        image: p.image?.startsWith("/") ? p.image : (p.image || "/images/p1.jpg"),
      };
    });

    await Product.deleteMany({});
    const inserted = await Product.insertMany(enriched);
    res.json({ success: true, inserted: inserted.length });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

export default router;
