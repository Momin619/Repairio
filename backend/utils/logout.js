export const logout = async (req, res) => {
  console.log("called logout function");

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.json({ message: "Logged Out" });
};
