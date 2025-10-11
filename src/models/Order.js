// src/models/Order.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const orderItemSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity:   { type: Number, required: true, min: 1 },
    unit_price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    // ✅ Cho phép khách không đăng nhập: user_id optional
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(v) => Array.isArray(v) && v.length > 0, "items must not be empty"]
    },

    total_amount:     { type: Number, required: true, min: 0 },
    shipping_address: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "completed", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
