import RepairItem from "../model/repairItem.js";

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
    const items = await RepairItem.find({ sellerId: req.user._id });
    res.status(200).json(items);
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
    if (!item)
      return res.status(404).json({ message: "Repair item not found" });

    item.status = status;

    // Set completedAt if status is completed
    if (status === "completed") {
      item.completedAt = new Date();
    } else {
      item.completedAt = null; // reset if changing back to in-repair
    }

    await item.save();

    res.status(200).json({ message: "Repair item status updated", item });
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
    const completedItems = await RepairItem.find({
      sellerId: req.user._id,
      status: "completed",
    }).lean(); // lean() gives plain JS objects

    // Add timeTaken field in hours
    const itemsWithTime = completedItems.map((item) => ({
      ...item,
      timeTakenHours: item.completedAt
        ? Math.round(
            (new Date(item.completedAt) - new Date(item.createdAt)) /
              (1000 * 60 * 60),
          )
        : null,
    }));

    res.status(200).json(itemsWithTime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
