import Subscription from "../model/subscription.js";
export const expireSubscription = async (req, res) => {
  const { subscriptionId } = req.body;
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) return res.status(404).json({ message: "Not found" });

  subscription.status = "expired";
  await subscription.save();

  res.json({ success: true });
};
