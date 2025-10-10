import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    category:    { type: String, required: true },                 // TOP/BOTTOM/ACCESSORIES...
    image:       { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    salePrice:   { type: Number, min: 0, default: null },          // optional
    discount:    { type: Number, min: 0, max: 1, default: 0 },     // optional (0.2 = 20%)
    brand:       { type: String, required: true },
    countInStock:{ type: Number, required: true, min: 0, default: 0 },
    rating:      { type: Number, required: true, min: 0, max: 5, default: 0 },
    numReviews:  { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ Thêm index để search/filter/pagination mượt
productSchema.index({ name: "text", brand: "text", description: "text" });
productSchema.index({ category: 1, price: 1, createdAt: -1 });

export default mongoose.model("Product", productSchema);
