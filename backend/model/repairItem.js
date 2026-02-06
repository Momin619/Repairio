import mongoose from "mongoose";
import crypto from "node:crypto";

const repairItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    problem: { type: String, required: true },
    repairCost: { type: Number, required: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "in-repair", "completed"],
      default: "pending",
    },
    startedAt: { type: Date }, // <-- new field
    completedAt: { type: Date },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trackingToken: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

repairItemSchema.pre("save", async function () {
  if (!this.trackingToken) {
    this.trackingToken = crypto.randomBytes(16).toString("hex");
  }
});

export default mongoose.model("RepairItem", repairItemSchema);
