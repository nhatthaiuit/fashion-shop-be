import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String }
  },
  { timestamps: true }
);

// Index phục vụ tìm kiếm tên
categorySchema.index({ name: "text" });

const Category = mongoose.model("Category", categorySchema);
export default Category;
