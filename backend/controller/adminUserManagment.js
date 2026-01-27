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
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from start

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

    // Update startDate if subscription expired
    subscription.startDate =
      subscription.endDate > now ? subscription.startDate : now;

    // Extend endDate by 30 days
    subscription.endDate = new Date(
      (subscription.endDate > now ? subscription.endDate : now).getTime() +
        30 * 24 * 60 * 60 * 1000,
    );

    subscription.status = "active";
    await subscription.save();

    res.json({ message: "Subscription extended by 30 days", subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Middleware to check if a user has an active subscription
export const checkSubscription = async (req, res, next) => {
  try {
    const user = req.user; // Comes from protect middleware
    console.log("checkSubscription called for user:", user._id);
    console.log("User subscription ID:", user.subscription);

    if (!user.subscription) {
      return res.status(403).json({
        message: "No active subscription. Please contact admin.",
      });
    }

    const subscription = await Subscription.findById(user.subscription);
    console.log("Fetched subscription:", subscription);

    if (!subscription) {
      return res.status(403).json({
        message: "Subscription not found",
      });
    }

    const now = new Date();
    console.log("Subscription endDate:", subscription.endDate);

    // Check if subscription expired
    if (subscription.endDate < now) {
      subscription.status = "expired";
      await subscription.save();

      return res.status(403).json({
        message: "Subscription has expired",
      });
    }

    // ✅ Subscription valid, attach to request
    req.subscription = subscription;

    // Optional: send response confirming subscription is valid
    res.status(200).json({ message: "Dashboard ok logging from backend" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
