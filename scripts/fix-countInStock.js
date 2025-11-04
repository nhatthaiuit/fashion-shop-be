import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../src/models/Product.js";

dotenv.config();

const NEED_SIZE = (cat) => ["Top", "Bottom"].includes(cat);

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected");

  const products = await Product.find();
  for (const p of products) {
    if (NEED_SIZE(p.category)) {
      const total = (p.sizes || []).reduce((sum, s) => sum + (s.stock || 0), 0);
      p.countInStock = total;
    }
    p.status = p.countInStock > 0 ? "available" : "out_of_stock";
    await p.save();
  }

  console.log("✨ Synced all products!");
  process.exit();
};

run();
