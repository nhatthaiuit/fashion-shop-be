import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    price: { type: Number, required: true, min: 0 },
    description: String,
    images: [String],
    stock: { type: Number, default: 0 },
    status: { type: String, enum: ["active","hidden"], default: "active" },
     category:    { type: String, required: true },
  },
  { timestamps: true }
);

// Index phục vụ lọc: category + price + status + createdAt
productSchema.index({ category: 1, price: 1, status: 1, createdAt: -1 });

// Index text cho tìm kiếm tên
productSchema.index({ name: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
