import User from "../model/user.js";
import Subscription from "../model/subscription.js";

// List all seller users with pagination
export const listUsers = async (req, res) => {
  try {
    // Parse page and limit from query params, default: page=1, limit=12
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const query = { role: "seller" }; // Only fetch sellers

    // Count total users matching query
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit); // Calculate total pages

    // Fetch users with pagination and populate subscription info
    const users = await User.find(query)
      .select("-password") // exclude password
      .populate("subscription") // include subscription details
      .skip((page - 1) * limit) // skip previous pages
      .limit(limit) // limit results
      .sort({ createdAt: -1 }); // newest first

    res.json({
      users,
      totalPages,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a subscription for a seller
export const createSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent creating subscription if one already exists
    if (user.subscription) {
      return res.status(400).json({ message: "Subscription already exists" });
    }
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 30); // 30 days from start

    const subscription = await Subscription.create({
      user: user._id,
      startDate,
      endDate,
      status: "active",
    });

    user.subscription = subscription._id;
    user.isActive = true; // activate/approve user
    await user.save();

    res.json({ message: "Subscription created", user, subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Extend existing subscription by 30 days
export const updateSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If no subscription exists, cannot update
    if (!user.subscription) {
      return res
        .status(400)
        .json({ message: "No subscription exists. Use create first." });
    }

    const now = new Date();
    const subscription = await Subscription.findById(user.subscription);

    // If subscription expired, reset startDate to now
    if (subscription.endDate < now) {
      subscription.startDate = now;
      subscription.endDate = new Date(now); // copy now
      subscription.endDate.setDate(now.getDate() + 30); // add 30 days
    } else {
      // If subscription is active, extend endDate by 30 days
      const newEndDate = new Date(subscription.endDate);
      newEndDate.setDate(subscription.endDate.getDate() + 30);
      subscription.endDate = newEndDate;
    }

    subscription.status = "active";
    await subscription.save();

    res.json({ message: "Subscription extended by 30 days", subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Middleware to check if a user has an active subscription
