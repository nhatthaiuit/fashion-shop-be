import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity:   { type: Number, required: true, min: 1 },
    unit_price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user_id:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order_date:       { type: Date, default: Date.now },
    total_amount:     { type: Number, required: true, min: 0 },
    status:           { type: String, enum: ["pending","paid","shipped","delivered","cancelled"], default: "pending" },
    shipping_address: { type: String },
    items:            { type: [orderItemSchema], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
