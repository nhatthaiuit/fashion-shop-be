import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username:     { type: String, required: true, unique: true, trim: true },
    password_hash:{ type: String, required: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    full_name:    { type: String, trim: true },
    address:      { type: String },
    phone_number: { type: String },
    role:         { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function(plain){
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(plain, salt);
};
userSchema.methods.comparePassword = function(plain){
  return bcrypt.compare(plain, this.password_hash);
};

export default mongoose.model("User", userSchema);
