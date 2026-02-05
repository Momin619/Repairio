export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });
  res.json({ message: "Logged Out" });
};
