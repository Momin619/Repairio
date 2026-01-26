import RepairItem from "../model/repairItem.js";
import { toWhatsAppNumber } from "../utils/phoneNumber.js";
// Create a new repair item
export const repairItemCreate = async (req, res) => {
  try {
    const { itemName, problem, customer } = req.body;

    if (!itemName || !problem || !customer) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let parsedCustomer;
    try {
      parsedCustomer = JSON.parse(customer);
    } catch {
      return res.status(400).json({ message: "Invalid customer data" });
    }

    const images = req.files
      ? req.files.map((file) => `/uploads/repair-items/${file.filename}`)
      : [];

    const repairItem = await RepairItem.create({
      itemName,
      problem,
      customer: parsedCustomer,
      images,
      sellerId: req.user._id,
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

// Get all repair items for seller
export const repairItemList = async (req, res) => {
  try {
    const { page = 1, limit = 12, search = "" } = req.query;

    const query = {
      sellerId: req.user._id,
      status: "in-repair",
      $or: [
        { itemName: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    };

    const totalItems = await RepairItem.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const items = await RepairItem.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ items, totalPages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single repair item by ID
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

    const item = await RepairItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Repair item not found" });
    }

    item.status = status;
    let whatsappLink = null;

    if (status === "completed") {
      item.completedAt = new Date();

      // Check if customer and phone exist
      const phone = item.customer?.phone;
      if (!phone) {
        return res
          .status(400)
          .json({ message: "Customer phone number not found" });
      }

      try {
        const whatsappNumber = toWhatsAppNumber(phone);

        const message = `Hello ${item.customer.name},
Your repair item (${item.itemName}) has been completed.
Thank you for choosing us!`;

        whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          message,
        )}`;
      } catch (err) {
        return res.status(400).json({ message: err.message });
      }
    } else {
      item.completedAt = null;
    }

    await item.save();

    // Send updated item + WhatsApp link to frontend
    res.status(200).json({
      message: "Repair item status updated",
      item,
      whatsappLink, // null if not completed or phone invalid
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

// Fetch repair history (all completed items for seller)
export const repairItemHistory = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 12 } = req.query;

    // Build search filter
    const searchFilter = {
      sellerId: req.user._id,
      status: "completed",
      $or: [
        { itemName: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
      ],
    };

    // Count total matching items
    const totalItems = await RepairItem.countDocuments(searchFilter);

    // Fetch items with pagination
    const completedItems = await RepairItem.find(searchFilter)
      .sort({ completedAt: -1 }) // newest first
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Map extra fields
    const itemsWithExtras = completedItems.map((item) => {
      let whatsappLink = null;

      if (item.customer?.phone) {
        try {
          const whatsappNumber = toWhatsAppNumber(item.customer.phone);
          const message = `Hello ${item.customer.name}, Your repair item (${item.itemName}) has been completed. Thank you for choosing us!`;
          whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        } catch {
          whatsappLink = null;
        }
      }

      // ⏱ Time calculation
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

      // 📅 Completion date & time
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

    // Total pages
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
