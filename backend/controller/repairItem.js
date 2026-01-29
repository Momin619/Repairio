import RepairItem from "../model/repairItem.js";
import User from "../model/user.js";
import { toWhatsAppNumber } from "../utils/phoneNumber.js";

// Create a new repair item

export const repairItemCreate = async (req, res) => {
  try {
    const { itemName, problem, customer, repairCost } = req.body;

    // Check required fields
    if (!itemName || !problem || !customer || !repairCost) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Parse customer JSON string into object
    let parsedCustomer;
    try {
      parsedCustomer = JSON.parse(customer);
    } catch {
      return res.status(400).json({ message: "Invalid customer data" });
    }

    // Map uploaded files to image paths
    const images = req.files
      ? req.files.map((file) => `/uploads/repair-items/${file.filename}`)
      : [];

    // Create repair item
    const repairItem = await RepairItem.create({
      itemName,
      problem,
      repairCost,
      customer: parsedCustomer,
      images,
      sellerId: req.user._id, // seller is logged-in user
    });

    res.status(201).json({
      message: "Repair item created",
      repairItem,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// List repair items for seller (in-repair)

export const repairItemList = async (req, res) => {
  try {
    const { page = 1, limit = 12, search = "" } = req.query;

    // Search filter
    const query = {
      sellerId: req.user._id,
      status: "in-repair",
      $or: [
        { itemName: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
      ],
    };

    const totalItems = await RepairItem.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    // Fetch paginated items
    const items = await RepairItem.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ items, totalPages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get repair item by ID

export const repairItemGetById = async (req, res) => {
  try {
    const item = await RepairItem.findById(req.params.id).populate(
      "sellerId",
      "name email",
    );

    if (!item)
      return res.status(404).json({ message: "Repair item not found" });

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update repair item status

export const repairItemUpdateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // 1️⃣ Find repair item
    const item = await RepairItem.findById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Repair item not found" });

    // 2️⃣ Ownership check
    if (item.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this repair item",
      });
    }

    item.status = status;
    let whatsappLink = null;

    if (status === "completed") {
      item.completedAt = new Date();

      // 3️⃣ Customer phone
      const customerPhone = item.customer?.phone;
      if (!customerPhone)
        return res
          .status(400)
          .json({ message: "Customer phone number not found" });

      // 4️⃣ Seller phone
      const seller = await User.findById(req.user._id);
      if (!seller?.phoneNumber)
        return res
          .status(400)
          .json({ message: "Seller phone number not found" });

      // 5️⃣ WhatsApp link generation
      try {
        const customerWhatsApp = toWhatsAppNumber(customerPhone);
        const message = `Hello ${item.customer.name}, Your repair item (${item.itemName}) has been completed. Thank you!`;

        // Opens WhatsApp chat; actual sending requires API
        whatsappLink = `https://wa.me/${customerWhatsApp}?text=${encodeURIComponent(
          message,
        )}`;
      } catch (err) {
        return res.status(400).json({ message: err.message });
      }
    } else {
      item.completedAt = null;
    }

    await item.save();

    res.status(200).json({
      message: "Repair item status updated",
      item,
      whatsappLink,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete repair item

export const repairItemDelete = async (req, res) => {
  try {
    const item = await RepairItem.findByIdAndDelete(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Repair item not found" });

    res.status(200).json({ message: "Repair item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Repair history (completed items)

export const repairItemHistory = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 12 } = req.query;

    const searchFilter = {
      sellerId: req.user._id,
      status: "completed",
      $or: [
        { itemName: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
      ],
    };

    const totalItems = await RepairItem.countDocuments(searchFilter);

    const completedItems = await RepairItem.find(searchFilter)
      .sort({ completedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const itemsWithExtras = completedItems.map((item) => {
      let whatsappLink = null;

      if (item.customer?.phone) {
        try {
          const whatsappNumber = toWhatsAppNumber(item.customer.phone);
          const message = `Hello ${item.customer.name}, Your repair item (${item.itemName}) has been completed. Thank you!`;
          whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        } catch {
          whatsappLink = null;
        }
      }

      let timeTakenValue = null;
      let timeTakenUnit = null;

      if (item.completedAt && item.createdAt) {
        const diffMs = new Date(item.completedAt) - new Date(item.createdAt);
        const diffMinutes = Math.round(diffMs / (1000 * 60));

        if (diffMinutes < 60) {
          timeTakenValue = diffMinutes;
          timeTakenUnit = "minutes";
        } else {
          timeTakenValue = Math.round(diffMinutes / 60);
          timeTakenUnit = "hours";
        }
      }

      const completedDate = item.completedAt
        ? new Date(item.completedAt).toLocaleDateString()
        : null;

      const completedTime = item.completedAt
        ? new Date(item.completedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null;

      return {
        ...item,
        timeTakenValue,
        timeTakenUnit,
        completedDate,
        completedTime,
        whatsappLink,
      };
    });

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      items: itemsWithExtras,
      page: parseInt(page),
      totalPages,
      totalItems,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Middleware: Check seller subscription active

export const sellerSubscriptionActive = (req, res, next) => {
  if (req.user && req.user.role === "seller") {
    const subscription = req.user.subscription;
    if (
      !subscription ||
      subscription.status !== "active" ||
      new Date(subscription.endDate) < new Date()
    ) {
      return res.status(403).json({ message: "Your subscription has expired" });
    }
  }
  next();
};

//
import mongoose from "mongoose";

export const getRevenue = async (req, res) => {
  try {
    const sellerObjectId = new mongoose.Types.ObjectId(req.user._id);

    const firstItem = await RepairItem.findOne({
      sellerId: sellerObjectId,
      status: "completed",
    }).sort({ completedAt: 1 });

    const lastItem = await RepairItem.findOne({
      sellerId: sellerObjectId,
      status: "completed",
    }).sort({ completedAt: -1 });

    if (!firstItem || !lastItem) {
      return res.json({ daily: [], weekly: [], monthly: [] });
    }

    const startDate = new Date(firstItem.completedAt);
    const endDate = new Date(lastItem.completedAt);

    /* ---------- DAILY ---------- */
    const dailyAgg = await RepairItem.aggregate([
      { $match: { sellerId: sellerObjectId, status: "completed" } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$completedAt",
              timezone: "Asia/Karachi",
            },
          },
          total: { $sum: "$repairCost" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyMap = Object.fromEntries(dailyAgg.map((d) => [d._id, d.total]));

    const daily = [];
    const dayCursor = new Date(startDate);
    dayCursor.setHours(0, 0, 0, 0);

    while (dayCursor <= endDate) {
      const dayStr = dayCursor.toLocaleDateString("en-CA", {
        timeZone: "Asia/Karachi",
      });

      daily.push({
        date: dayStr,
        total: dailyMap[dayStr] || 0,
      });

      dayCursor.setDate(dayCursor.getDate() + 1);
    }

    /* ---------- WEEKLY (7-DAY BLOCKS FROM FIRST ITEM) ---------- */

    /* ---------- WEEKLY (7-DAY BLOCKS, timezone-consistent) ---------- */
    const weeklyAgg = await RepairItem.aggregate([
      { $match: { sellerId: sellerObjectId, status: "completed" } },
      {
        $addFields: {
          completedAtKarachi: {
            $dateFromString: {
              dateString: {
                $dateToString: {
                  date: "$completedAt",
                  timezone: "Asia/Karachi",
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          daysFromStart: {
            $floor: {
              $divide: [
                { $subtract: ["$completedAtKarachi", startDate] },
                1000 * 60 * 60 * 24,
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: { weekIndex: { $floor: { $divide: ["$daysFromStart", 7] } } },
          total: { $sum: "$repairCost" },
        },
      },
      { $sort: { "_id.weekIndex": 1 } },
    ]);

    const weekly = weeklyAgg.map((w) => {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + w._id.weekIndex * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      // Convert to Asia/Karachi ISO-like string
      const startStr = weekStart.toLocaleDateString("en-CA", {
        timeZone: "Asia/Karachi",
      });
      const endStr = weekEnd.toLocaleDateString("en-CA", {
        timeZone: "Asia/Karachi",
      });

      return {
        week: w._id.weekIndex + 1,
        total: w.total,
        start: startStr,
        end: endStr,
      };
    });

    /* ---------- MONTHLY ---------- */
    const monthlyAgg = await RepairItem.aggregate([
      { $match: { sellerId: sellerObjectId, status: "completed" } },
      {
        $group: {
          _id: {
            year: { $year: "$completedAt" },
            month: { $month: "$completedAt" },
          },
          total: { $sum: "$repairCost" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthly = monthlyAgg.map((m) => ({
      year: m._id.year,
      month: m._id.month,
      total: m.total,
    }));

    res.json({ daily, weekly, monthly });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
