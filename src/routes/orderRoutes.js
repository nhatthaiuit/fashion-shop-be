import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createOrder, myOrders } from "../controllers/order.controller.js";

const router = Router();
router.post("/", protect, createOrder);
router.get("/mine", protect, myOrders);

export default router;
