export const checkSubscriptionExpiry = async (subscription) => {
  const now = new Date();
  const endDate = new Date(subscription.endDate);

  console.log("SERVER NOW:", now);
  console.log("END DATE:", endDate);

  if (now >= endDate && subscription.status !== "expired") {
    console.log("MARKING EXPIRED");
    subscription.status = "expired";
    await subscription.save();
  }

  return subscription;
};
