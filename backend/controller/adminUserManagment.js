import User from "../model/user.js";
import Subscription from "../model/subscription.js";

export const listUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "seller" })
      .select("-password")
      .populate("subscription");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve seller + activate subscription
export const createSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.subscription) {
      return res.status(400).json({ message: "Subscription already exists" });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30); // 30-day initial subscription

    const subscription = await Subscription.create({
      user: user._id,
      startDate,
      endDate,
      status: "active",
    });

    user.subscription = subscription._id;
    user.isActive = true; // approve user
    await user.save();

    res.json({ message: "Subscription created", user, subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.subscription) {
      return res
        .status(400)
        .json({ message: "No subscription exists. Use create first." });
    }
    const now = new Date();
    const subscription = await Subscription.findById(user.subscription);
    subscription.startDate =
      subscription.endDate > now ? subscription.startDate : now;
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
