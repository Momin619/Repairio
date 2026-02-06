import express from "express";

import {
  repairItemCreate,
  repairItemDelete,
  repairItemGetById,
  repairItemHistory,
  repairItemList,
  repairItemCompleteRepair,
  sellerSubscriptionActive,
  getRevenue,
  trackRepairItem,
  repairItemStartRepair,
} from "../controller/repairItem.js";

import { protect } from "../middlewares/auth.js";

import { upload } from "../utils/multer.js";

const repairItemRouter = express.Router();

repairItemRouter.get("/revenue", protect, sellerSubscriptionActive, getRevenue);

repairItemRouter.get("/repairs/track/:token", trackRepairItem);

repairItemRouter.post(
  "/repair-item",
  protect,
  sellerSubscriptionActive,
  upload.single("image"), // single image
  repairItemCreate,
);

repairItemRouter.get(
  "/repair-items",
  protect,
  sellerSubscriptionActive,
  repairItemList,
); // List all

repairItemRouter.get(
  "/repair-items/history/completed",
  protect,
  sellerSubscriptionActive,
  repairItemHistory,
); // Completed items only

repairItemRouter.get(
  "/repair-item/:id",
  protect,
  sellerSubscriptionActive,
  repairItemGetById,
); // Single item

repairItemRouter.patch(
  "/repair-item/:id/start-repair",
  protect,
  sellerSubscriptionActive,
  repairItemStartRepair,
);

repairItemRouter.patch(
  "/repair-item/:id/complete-repair",
  protect,
  sellerSubscriptionActive,
  repairItemCompleteRepair,
); // Update status

repairItemRouter.delete(
  "/repair-item/:id/delete",
  protect,
  sellerSubscriptionActive,
  repairItemDelete,
); // Deleteiption);

export default repairItemRouter;
