import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";


/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Create an order (require login)
 *     tags: [Orders]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               shipping_address: { type: string }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [product_id, quantity]
 *                   properties:
 *                     product_id: { type: string }
 *                     quantity:   { type: integer, minimum: 1 }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Bad request }
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shipping_address } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400); throw new Error("items is required");
  }
  const enriched = [];
  let total = 0;

  for (const it of items) {
    const prod = await Product.findById(it.product_id);
    if (!prod) { res.status(400); throw new Error("Invalid product: " + it.product_id); }
    if (prod.countInStock < it.quantity) {
      res.status(400); throw new Error(`Insufficient stock for ${prod.name}`);
    }
    const unit_price = prod.price;
    enriched.push({ product_id: prod._id, quantity: it.quantity, unit_price });
    total += unit_price * it.quantity;

    // trừ tồn
    prod.countInStock -= it.quantity;
    await prod.save();
  }

  const order = await Order.create({
    user_id: req.user.id,
    items: enriched,
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
