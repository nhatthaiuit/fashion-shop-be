import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true, unique: true, trim: true },
    password_hash: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    full_name: { type: String, default: "" },
    phone_number: { type: String, default: "" },
    address: { type: String, default: "" },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

userSchema.methods.setPassword = async function (plain) {
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(plain, salt);
};
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password_hash);
};

export default mongoose.model("User", userSchema);
