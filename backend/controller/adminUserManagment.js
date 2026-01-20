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

export const createSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.subscription) {
      return res.status(400).json({ message: "Subscription already exists" });
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 5 * 60 * 1000);

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

export const checkSubscription = async (req, res, next) => {
  console.log("called dashboard controller");

  try {
    const user = req.user; // comes from protect middleware
    console.log(user);

    if (!user.subscription) {
      return res.status(403).json({
        message: "No active subscription. Please contact admin.",
      });
    }

    const subscription = await Subscription.findById(user.subscription);

    if (!subscription) {
      return res.status(403).json({
        message: "Subscription not found",
      });
    }

    const now = new Date();

    if (subscription.endDate < now) {
      subscription.status = "expired";
      await subscription.save();

      return res.status(403).json({
        message: "Subscription has expired",
      });
    }

    // ✅ subscription valid
    req.subscription = subscription;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
