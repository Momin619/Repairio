import User from "../model/user.js";
import Subscription from "../model/subscription.js";

export const activateSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + 30);

    const sub = await Subscription.findOneAndUpdate(
      { user: user._id },
      { user: user._id, startDate: start, endDate: end, status: "active" },
      { upsert: true, new: true }
    );

    user.subscription = sub._id;
    user.isActive = true;
    await user.save();

    res.json({ message: "Subscription activated", subscription: sub });
  } catch (err) {
    res.status(500).json({ message: "Activation failed", error: err.message });
  }
};
