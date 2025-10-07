import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    category:    { type: String, required: true },
    image:       { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    brand:       { type: String, required: true },
    countInStock:{ type: Number, required: true, min: 0, default: 0 },
    rating:      { type: Number, required: true, min: 0, max: 5, default: 0 },
    numReviews:  { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

// Gợi ý index để filter/search mượt hơn
productSchema.index({ name: 'text', brand: 'text', category: 'text' });
productSchema.index({ category: 1, brand: 1, price: 1, createdAt: -1 });


export default mongoose.model("Product", productSchema);
