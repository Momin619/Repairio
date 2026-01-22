import mongoose from "mongoose";

const repairItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    problem: { type: String, required: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    images: {
      type: [String], // store image URLs/paths
      default: [],
    },
    status: {
      type: String,
      enum: ["in-repair", "completed"],
      default: "in-repair",
    },

    completedAt: { type: Date },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("RepairItem", repairItemSchema);
