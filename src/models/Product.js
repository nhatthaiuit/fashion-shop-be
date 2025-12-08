import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    label: { type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"], required: true },
    stock: { type: Number, min: 0, default: 0 }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  images: { type: [String], default: [] },
  price: { type: Number, required: true, min: 0 },

  // NOTE: với Top/Bottom, field này là *derived* từ sizes
  countInStock: { type: Number, required: true, min: 0, default: 0 },
  sizes: { type: [sizeSchema], default: [] },

  description: { type: String, default: "" },

  status: {
    type: String,
    enum: ["available", "out_of_stock", "discontinued"],
    default: "available"
  }
}, { timestamps: true });

// helpers
const NEED_SIZE = (cat) => ["Top", "Bottom"].includes(cat);

// tổng tồn theo sizes
productSchema.virtual("sizesTotalStock").get(function () {
  return (this.sizes || []).reduce((s, x) => s + (x.stock || 0), 0);
});

// 1) Trước validate: ép invariant
productSchema.pre("validate", function (next) {
  if (NEED_SIZE(this.category)) {
    // với Top/Bottom: countInStock *derive* từ sizes
    this.countInStock = this.sizesTotalStock || 0;
  } else {
    // với danh mục khác: nếu có sizes thì cũng derive, không thì giữ nguyên
    if (Array.isArray(this.sizes) && this.sizes.length > 0) {
      this.countInStock = this.sizesTotalStock || 0;
    }
  }
  next();
});

// 2) Trước save: set status dựa vào countInStock đã được derive/clean ở trên
productSchema.pre("save", function (next) {
  this.status = (this.countInStock || 0) > 0 ? "available" : "out_of_stock";
  next();
});

// (tuỳ chọn) Validator để chặn payload cố tình đặt countInStock sai cho Top/Bottom
productSchema.path("countInStock").validate(function (v) {
  if (NEED_SIZE(this.category)) {
    return v === this.sizesTotalStock; // bắt buộc đúng invariant
  }
  return true;
}, "countInStock must equal sum(sizes.stock) for sized categories.");

productSchema.index({ name: "text", category: "text" });
productSchema.index({ category: 1, price: 1, createdAt: -1 });

export default mongoose.model("Product", productSchema);
