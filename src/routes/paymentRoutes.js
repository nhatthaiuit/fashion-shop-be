import express from "express";
import { getPaypalConfig } from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/config/paypal", getPaypalConfig);

export default router;
