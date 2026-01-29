"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FiTool, FiMenu } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLocation, Link } from "react-router-dom";

export default function ResponsiveAppBar() {
  const { theme } = useTheme();
  const { auth, logout } = useAuth();
  const { isLoggedIn, role } = auth;
  const location = useLocation();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  // Auth links
  const authLinks = isLoggedIn
    ? [
        { name: "Settings", to: "/settings" },
        { name: "Logout", action: () => logout() },
      ]
    : [
        { name: "Login", to: "/login" },
        { name: "Signup", to: "/signup" },
      ];

  // Seller links
  const sellerLinks =
    role === "seller"
      ? [
          { name: "Dashboard", to: "/dashboard" },
          { name: "Add Item", to: "/repair-item" },
          { name: "Repair History", to: "/repair-history" },
          { name: "Revenue", to: "/revenue" },
        ]
      : [];

  // Helper to get active link styles
  const getLinkStyles = (linkTo) => ({
    backgroundColor:
      location.pathname === linkTo
        ? theme === "dark"
          ? "#444" // dark theme active background
          : "#e0e0e0" // light theme active background
        : "transparent",
    color: theme === "dark" ? "#fff" : "#111",
    textTransform: "none",
  });

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: theme === "dark" ? "#111" : "#fff",
        color: theme === "dark" ? "#fff" : "#111",
        borderBottom: theme === "dark" ? "1px solid #333" : "1px solid #ddd",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Brand */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <FiTool size={26} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ ml: 1, textDecoration: "none", color: "inherit" }}
            >
              Repairio
            </Typography>
          </Box>

          {/* Seller links (desktop only) */}
          {sellerLinks.length > 0 && (
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              {sellerLinks.map((link) => (
                <Button
                  key={link.name}
                  component={Link}
                  to={link.to}
                  sx={getLinkStyles(link.to)}
                >
                  {link.name}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Auth links (desktop only) */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {authLinks.map((link) =>
              link.action ? (
                <Button
                  key={link.name}
                  onClick={link.action}
                  sx={getLinkStyles("")}
                >
                  {link.name}
                </Button>
              ) : (
                <Button
                  key={link.name}
                  component={Link}
                  to={link.to}
                  sx={getLinkStyles(link.to)}
                >
                  {link.name}
                </Button>
              ),
            )}
          </Box>

          {/* Mobile menu (ALL users) */}
          {/* Mobile menu (ALL users) */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              onClick={openMenu}
              sx={{ color: theme === "dark" ? "#fff" : "#111" }}
            >
              <FiMenu />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
            >
              {/* ⚡ Only auth links for mobile */}
              {authLinks.map((link) =>
                link.action ? (
                  <MenuItem
                    key={link.name}
                    onClick={() => {
                      link.action();
                      closeMenu();
                    }}
                    sx={{ color: theme === "dark" ? "#fff" : "#111" }}
                  >
                    {link.name}
                  </MenuItem>
                ) : (
                  <MenuItem
                    key={link.name}
                    component={Link}
                    to={link.to}
                    onClick={closeMenu}
                    sx={{ color: theme === "dark" ? "#fff" : "#111" }}
                  >
                    {link.name}
                  </MenuItem>
                ),
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
