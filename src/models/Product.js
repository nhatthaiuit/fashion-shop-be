import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    category:    { type: String, required: true },
    image:       { type: String, required: true }, // ảnh chính
    images:      { type: [String], default: [] },  // 👈 thêm: ảnh phụ (gallery)
    price:       { type: Number, required: true, min: 0 },
    brand:       { type: String, required: true },

    countInStock:{ type: Number, required: true, min: 0, default: 0 }, // tổng tồn

    // 👇 thêm: tồn kho theo từng size
    sizes: {
      type: [
        {
          label: { type: String, enum: ['XS','S','M','L','XL','XXL'], required: true },
          stock: { type: Number, default: 0, min: 0 },
        },
      ],
      default: [],
    },

    rating:      { type: Number, required: true, min: 0, max: 5, default: 0 },
    numReviews:  { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, default: "" },

    // 👇 thêm: trạng thái hàng (để FE dễ sắp xếp và hiển thị)
    status: {
      type: String,
      enum: ['available', 'out_of_stock', 'discontinued'],
      default: function () {
        return this.countInStock > 0 ? 'available' : 'out_of_stock';
      },
    },
  },
  { timestamps: true }
);

// Auto-update status khi lưu
productSchema.pre('save', function (next) {
  this.status = this.countInStock > 0 ? 'available' : 'out_of_stock';
  next();
});

// Gợi ý index để filter/search mượt hơn
productSchema.index({ name: 'text', brand: 'text', category: 'text' });
productSchema.index({ category: 1, brand: 1, price: 1, createdAt: -1 });

export default mongoose.model("Product", productSchema);
