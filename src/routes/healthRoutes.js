import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/healthz", (req, res) => {
  const dbOk = mongoose.connection.readyState === 1 ? "up" : "down";
  res.json({ ok: true, db: dbOk, uptime: process.uptime() });
});

export default router;
