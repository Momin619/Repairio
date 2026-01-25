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
import { useLocation, Link } from "react-router-dom";

export default function ResponsiveAppBar() {
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
        { name: "Logout", action: logout },
      ]
    : [
        { name: "Login", to: "/login" },
        { name: "Signup", to: "/signup" },
      ];

  // Seller links (desktop only)
  const sellerLinks =
    role === "seller"
      ? [
          { name: "Dashboard", to: "/dashboard" },
          { name: "Add Item", to: "/repair-item" },
          { name: "Repair History", to: "/repair-history" },
        ]
      : [];

  return (
    <AppBar position="sticky">
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

          {/* Seller links (DESKTOP ONLY) */}
          {role === "seller" && sellerLinks.length > 0 && (
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              {sellerLinks.map((link) => (
                <Button
                  key={link.name}
                  component={Link}
                  to={link.to}
                  sx={{
                    backgroundColor:
                      location.pathname === link.to ? "#e0e0e0" : "transparent",
                  }}
                >
                  {link.name}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Auth buttons (DESKTOP ONLY) */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {authLinks.map((link) =>
              link.action ? (
                <Button key={link.name} onClick={link.action}>
                  {link.name}
                </Button>
              ) : (
                <Button
                  key={link.name}
                  component={Link}
                  to={link.to}
                  sx={{
                    backgroundColor:
                      location.pathname === link.to ? "#e0e0e0" : "transparent",
                  }}
                >
                  {link.name}
                </Button>
              ),
            )}
          </Box>

          {/* Mobile menu (ONLY when dock is visible) */}
          {role === "seller" && (
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton onClick={openMenu}>
                <FiMenu />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
              >
                {authLinks.map((link) =>
                  link.action ? (
                    <MenuItem
                      key={link.name}
                      onClick={() => {
                        link.action();
                        closeMenu();
                      }}
                    >
                      {link.name}
                    </MenuItem>
                  ) : (
                    <MenuItem
                      key={link.name}
                      component={Link}
                      to={link.to}
                      onClick={closeMenu}
                    >
                      {link.name}
                    </MenuItem>
                  ),
                )}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
