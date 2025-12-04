import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/auth.js";
import {
  createOrder,
  myOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = Router();

// JSDoc comments are in order.controller.js
router.post("/", createOrder);
router.get("/mine", protect, myOrders);

// Admin routes
router.get("/", protect, isAdmin, getOrders);
router.get("/:id", protect, isAdmin, getOrderById);
router.put("/:id/status", protect, isAdmin, updateOrderStatus);

export default router;

