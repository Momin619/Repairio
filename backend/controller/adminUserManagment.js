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
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);

    const subscription = await Subscription.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        startDate,
        endDate,
        status: "active",
      },
      { upsert: true, new: true },
    );

    user.isActive = true;
    user.subscription = subscription._id;
    await user.save();

    res.json({
      message: "User approved and subscription activated",
      user,
      subscription,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
