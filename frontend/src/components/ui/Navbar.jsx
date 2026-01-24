"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FiTool, FiSun, FiMoon, FiMenu } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLocation, Link } from "react-router-dom"; // <-- For routing

export default function ResponsiveAppBar() {
  const { auth, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, role } = auth;

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  // Role-based links
  const roleLinks = {
    admin: [{ name: "Admin Dashboard", to: "/admin/dashboard" }],
    seller: [
      { name: "Dashboard", to: "/dashboard" },
      { name: "Add Item", to: "/repair-item" },
      { name: "Repair History", to: "/repair-history" },
    ],
  };

  const currentLinks = isLoggedIn ? roleLinks[role] || [] : [];

  // Auth links
  const authLinks = isLoggedIn
    ? [...currentLinks, { name: "Logout", action: logout }]
    : [
        { name: "Login", to: "/login" },
        { name: "Signup", to: "/signup" },
      ];

  const location = useLocation(); // Get current path

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
            <FiTool size={28} color="#1976d2" />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                ml: 1,
                fontWeight: 700,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              Repairio
            </Typography>
          </Box>

          {/* Desktop links */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            {authLinks.map((link) =>
              link.action ? (
                <Button
                  key={link.name}
                  onClick={link.action}
                  sx={{
                    color: theme === "dark" ? "#fff" : "#111",
                    textTransform: "none",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: theme === "dark" ? "#444" : "#f0f0f0",
                      color: "#1976d2",
                    },
                  }}
                >
                  {link.name}
                </Button>
              ) : (
                <Button
                  key={link.name}
                  component={Link}
                  to={link.to}
                  sx={{
                    color: theme === "dark" ? "#fff" : "#111",
                    textTransform: "none",
                    backgroundColor:
                      location.pathname === link.to
                        ? theme === "dark"
                          ? "#444"
                          : "#e0e0e0"
                        : "transparent",
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: theme === "dark" ? "#333" : "#d0d0d0",
                      color: "#1976d2",
                    },
                  }}
                >
                  {link.name}
                </Button>
              ),
            )}

            {/* Theme toggle */}
            <IconButton
              onClick={toggleTheme}
              sx={{
                ml: 1,
                color: theme === "dark" ? "#fff" : "#111",
                "&:hover": {
                  backgroundColor: theme === "dark" ? "#222" : "#f0f0f0",
                },
              }}
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </IconButton>
          </Box>

          {/* Mobile menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <FiMenu />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {authLinks.map((link) =>
                link.action ? (
                  <MenuItem
                    key={link.name}
                    onClick={() => {
                      link.action();
                      handleCloseNavMenu();
                    }}
                  >
                    {link.name}
                  </MenuItem>
                ) : (
                  <MenuItem
                    key={link.name}
                    component={Link}
                    to={link.to}
                    onClick={handleCloseNavMenu}
                    sx={{
                      backgroundColor:
                        location.pathname === link.to
                          ? theme === "dark"
                            ? "#222"
                            : "#e0e0e0"
                          : "transparent",
                    }}
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
