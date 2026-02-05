export const checkSubscriptionExpiry = async (subscription) => {
  const now = new Date();
  const endDate = new Date(subscription.endDate);

  if (now >= endDate && subscription.status !== "expired") {
    subscription.status = "expired";
    await subscription.save();
  }

  return subscription;
};
