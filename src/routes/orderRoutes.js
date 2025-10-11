// src/routes/orderRoutes.js
import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createOrder, myOrders } from "../controllers/order.controller.js";

const router = Router();
router.post("/", createOrder);          // KHÔNG yêu cầu login
router.get("/mine", protect, myOrders); // Cần login
export default router;
