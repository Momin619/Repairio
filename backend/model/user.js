import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: String,
    shopName: String,
    email: { type: String, unique: true },
    password: String,

    role: {
      type: String,
      enum: ["seller", "admin"],
      default: "seller",
    },

    isActive: {
      type: Boolean,
      default: false, // admin approval
    },

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);
