export const checkSubscriptionExpiry = async (subscription) => {
  if (!subscription) return null;

  const now = new Date(); // SERVER TIME
  const endDate = new Date(subscription.endDate);

  if (now >= endDate && subscription.status !== "expired") {
    subscription.status = "expired";
    await subscription.save();
  }

  return subscription;
};
