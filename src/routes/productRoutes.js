import express from "express";
import Product from "../models/Product.js";
import products from "../data.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const list = await Product.find();
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/seed", async (req, res) => {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    res.json({ inserted: inserted.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
