import RepairItem from "../model/repairItem.js";
import User from "../model/user.js";
import { toWhatsAppNumber } from "../utils/phoneNumber.js";
import mongoose from "mongoose";
import { checkSubscriptionExpiry } from "../utils/subscription.js";
import Subscription from "../model/subscription.js";
// Create a new repair item

export const trackRepairItem = async (req, res) => {
  try {
    const item = await RepairItem.findOne({
      trackingToken: req.params.token,
    }).select(
      "itemName problem status repairCost createdAt completedAt customer.name",
    );

    if (!item) {
      return res.status(404).json({ message: "Invalid tracking link" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

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
    const trackingLink = `${process.env.FRONTEND_URL}/track/${repairItem.trackingToken}`;
    const customerWhatsApp = toWhatsAppNumber(parsedCustomer.phone);

    const message = `Assalam Alaikum ${parsedCustomer.name},
Your repair item has been registered.

Item: ${itemName}
Status: In Repair

Track your repair here:
${trackingLink}`;

    const whatsappLink = `https://wa.me/${customerWhatsApp}?text=${encodeURIComponent(message)}`;

    res.status(201).json({
      message: "Repair item created",
      repairItem,
      trackingLink,
      whatsappLink,
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

export const sellerSubscriptionActive = async (req, res, next) => {
  try {
    // Only sellers need subscription check
    if (req.user?.role !== "seller") return next();

    if (!req.user.subscription) {
      return res.status(403).json({
        code: "NO_SUBSCRIPTION",
        message: "No subscription found",
      });
    }

    // Fetch fresh subscription from DB
    const subscription = await Subscription.findById(req.user.subscription._id);
    if (!subscription) {
      return res.status(403).json({
        code: "NO_SUBSCRIPTION",
        message: "Subscription not found",
      });
    }

    // 🔑 Single source of truth
    const updatedSubscription = await checkSubscriptionExpiry(subscription);

    // Attach updated subscription to req.user
    req.user.subscription = updatedSubscription;

    // Block request if expired
    if (updatedSubscription.status === "expired") {
      return res.status(403).json({
        code: "SUBSCRIPTION_EXPIRED",
        message: "Your subscription has expired",
      });
    }

    next();
  } catch (err) {
    console.error("[sellerSubscriptionActive]", err);
    res.status(500).json({ message: "Subscription check failed" });
  }
};

//

export const getRevenue = async (req, res) => {
  try {
    const sellerObjectId = new mongoose.Types.ObjectId(req.user._id);

    // 🔹 First completed repair (THIS defines Day 1)
    const firstCompleted = await RepairItem.findOne({
      sellerId: sellerObjectId,
      status: "completed",
    }).sort({ completedAt: 1 });

    if (!firstCompleted) {
      return res.json({ monthly: [] });
    }

    const startDate = new Date(firstCompleted.completedAt);

    /* ---------- ROLLING 30-DAY MONTHS ---------- */
    const monthlyAgg = await RepairItem.aggregate([
      {
        $match: {
          sellerId: sellerObjectId,
          status: "completed",
        },
      },

      // Normalize completedAt to Karachi timezone
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

      // Days since first completed item
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

      // 30-day rolling month index
      {
        $group: {
          _id: {
            periodIndex: {
              $floor: { $divide: ["$daysFromStart", 30] },
            },
          },
          total: { $sum: "$repairCost" },
        },
      },

      { $sort: { "_id.periodIndex": 1 } },
    ]);

    const monthly = monthlyAgg.map((m) => {
      const periodStart = new Date(startDate);
      periodStart.setDate(periodStart.getDate() + m._id.periodIndex * 30);

      const periodEnd = new Date(periodStart);
      periodEnd.setDate(periodStart.getDate() + 29);

      return {
        cycle: `Month ${m._id.periodIndex + 1}`,
        start: periodStart.toLocaleDateString("en-CA", {
          timeZone: "Asia/Karachi",
        }),
        end: periodEnd.toLocaleDateString("en-CA", {
          timeZone: "Asia/Karachi",
        }),
        total: m.total,
      };
    });

    res.json({ monthly });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
