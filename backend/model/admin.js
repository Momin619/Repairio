import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      default: "admin",
      enum: ["admin"],
    },
    isActive: {
      type: Boolean,
      default: true, // admins are active by default
    },
  },
  { timestamps: true },
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("Admin", adminSchema);
