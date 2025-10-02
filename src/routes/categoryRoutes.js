import express from "express";
import slugify from "slugify";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createCategorySchema, updateCategorySchema } from "../validators/category.schema.js";
import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: List all categories
 *     tags: [Categories]
 */
router.get("/", asyncHandler(async (req, res) => {
  const list = await Category.find().sort({ name: 1 });
  res.json(list);
}));

/**
 * @openapi
 * /api/categories/{slug}:
 *   get:
 *     summary: Get category by slug
 *     tags: [Categories]
 */
router.get("/:slug", asyncHandler(async (req, res) => {
  const doc = await Category.findOne({ slug: req.params.slug });
  if (!doc) throw new ApiError(404, "Not found");
  res.json(doc);
}));

/**
 * @openapi
 * /api/categories:
 *   post:
 *     summary: Create category (admin)
 *     tags: [Categories]
 */
router.post("/", requireAuth(["admin"]), validate(createCategorySchema),
  asyncHandler(async (req, res) => {
    const slug = slugify(req.body.name, { lower: true });
    // kiểm tra trùng
    const existed = await Category.findOne({ slug });
    if (existed) throw new ApiError(409, "Category existed");
    const doc = await Category.create({ ...req.body, slug });
    res.status(201).json(doc);
  })
);

/**
 * @openapi
 * /api/categories/{id}:
 *   patch:
 *     summary: Update category (admin)
 *     tags: [Categories]
 */
router.patch("/:id", requireAuth(["admin"]), validate(updateCategorySchema),
  asyncHandler(async (req, res) => {
    if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true });
    const doc = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) throw new ApiError(404, "Not found");
    res.json(doc);
  })
);

/**
 * @openapi
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category (admin)
 *     tags: [Categories]
 */
router.delete("/:id", requireAuth(["admin"]),
  asyncHandler(async (req, res) => {
    const del = await Category.findByIdAndDelete(req.params.id);
    if (!del) throw new ApiError(404, "Not found");
    res.status(204).end();
  })
);

export default router;
