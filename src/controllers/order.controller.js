// src/controllers/order.controller.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Create an order (no login required)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               shipping_address:
 *                 type: string
 *               items:
 *                 type: array
 *                 description: Accepts product_id|product|_id|id and quantity|qty
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id: { type: string }
 *                     product:    { type: string }
 *                     _id:        { type: string }
 *                     id:         { type: string }
 *                     quantity:   { type: integer, minimum: 1 }
 *                     qty:        { type: integer, minimum: 1 }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Bad request }
 */
export const createOrder = asyncHandler(async (req, res) => {
  // Đọc body an toàn
  const body = req.body || {};
  const shipping_address = body.shipping_address || body.address || "";
  const rawItems = Array.isArray(body.items) ? body.items : [];

  if (!rawItems.length) {
    res.status(400);
    throw new Error("items is required");
  }

  const orderItems = [];
  let total = 0;

  for (const it of rawItems) {
    // Chấp nhận nhiều tên trường id
    const pid =
      it?.product_id ??
      it?.product ??
      it?._id ??
      it?.id ??
      null;

    const qty = Math.max(1, Number(it?.quantity ?? it?.qty ?? 1));

    if (!pid || !mongoose.Types.ObjectId.isValid(String(pid))) {
      res.status(400);
      throw new Error(`Invalid product: ${pid ?? "undefined"}`);
    }

    const prod = await Product.findById(pid);
    if (!prod) {
      res.status(400);
      throw new Error(`Product not found: ${pid}`);
    }

    if (Number(prod.countInStock || 0) < qty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${prod.name}`);
    }

    const unit_price = Number(prod.price || 0);
    orderItems.push({
      product_id: prod._id,      // lưu lại id thật trong order
      quantity: qty,
      unit_price,
    });
    total += unit_price * qty;

    // Trừ tồn kho
    prod.countInStock = Number(prod.countInStock || 0) - qty;
    await prod.save();
  }

  const order = await Order.create({
    user_id: req.user?.id || null, // không đăng nhập vẫn OK
    items: orderItems,
    total_amount: total,
    shipping_address,
    status: "pending",
  });

  res.status(201).json(order);
});

/**
 * @openapi
 * /api/orders/mine:
 *   get:
 *     summary: Get my orders
 *     tags: [Orders]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: OK }
 */
export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user_id: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});
//-------------------------------------------------------------
// ADMIN FUNCTIONS
//-------------------------------------------------------------

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Orders]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: OK }
 */
export const getOrders = asyncHandler(async (req, res) => {
  const page  = Number(req.query.page)  || 1;
  const limit = Number(req.query.limit) || 20;
  const skip  = (page - 1) * limit;

  const total = await Order.countDocuments();
  const items = await Order.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.setHeader("X-Total-Count", total);
  res.json({
    meta: {
      page, limit, total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
    items,
  });
});

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     summary: Get single order by ID (admin)
 *     tags: [Orders]
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not Found }
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const doc = await Order.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Order not found" });
  res.json(doc);
});

/**
 * @openapi
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (admin)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, completed, cancelled]
 *     responses:
 *       200: { description: Updated }
 *       400: { description: Invalid status }
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "processing", "shipped", "completed", "cancelled"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const doc = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!doc) return res.status(404).json({ message: "Order not found" });
  res.json(doc);
});
