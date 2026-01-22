import express from "express";

import {
  repairItemCreate,
  repairItemDelete,
  repairItemGetById,
  repairItemHistory,
  repairItemList,
  repairItemUpdateStatus,
} from "../controller/repairItem.js";

import { protect } from "../middlewares/auth.js";
import { upload } from "../utils/multer.js";
const repairItemRouter = express.Router();
repairItemRouter.post(
  "/repair-item",
  protect,
  upload.array("images", 5),
  repairItemCreate,
); // Create
repairItemRouter.get("/repair-items", protect, repairItemList); // List all
repairItemRouter.get(
  "/repair-items/history/completed",
  protect,
  repairItemHistory,
); // Completed items only
repairItemRouter.get("/repair-item/:id", protect, repairItemGetById); // Single item
repairItemRouter.patch(
  "/repair-item/:id/update-status",
  protect,
  repairItemUpdateStatus,
); // Update status
repairItemRouter.delete("/repair-item/:id/delete", protect, repairItemDelete); // Deleteiption);

export default repairItemRouter;
