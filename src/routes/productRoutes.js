import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post("/seed", async (req, res) => {
  const sample = [
    { name: "T-Shirt Basic", price: 149000 },
    { name: "Jeans Slimfit", price: 399000 },
    { name: "Hoodie Oversize", price: 499000 }
  ];
  const out = await Product.insertMany(sample);
  res.json({ inserted: out.length });
});

export default router;
