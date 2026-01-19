import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    shopName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      match: [/^[0-9]{10,15}$/, "Invalid phone number"], // 🔒 validation
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["seller"],
      default: "seller",
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);
