"use client";
import React from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { FiHome, FiPlusCircle, FiList } from "react-icons/fi";
import { FaDollarSign } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SellerDock() {
  const { auth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (auth.role !== "seller") return null; // Only sellers see this dock

  const sellerLinks = [
    { name: "Dashboard", to: "/dashboard", icon: <FiHome /> },
    { name: "Add Item", to: "/repair-item", icon: <FiPlusCircle /> },
    { name: "Repair History", to: "/repair-history", icon: <FiList /> },
    { name: "Revenue", to: "/revenue", icon: <FaDollarSign /> },
  ];

  const currentIndex = sellerLinks.findIndex(
    (link) => link.to === location.pathname,
  );
  const [value, setValue] = React.useState(
    currentIndex === -1 ? 0 : currentIndex,
  );

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: "block", md: "none" }, // visible till tablets
        zIndex: 2000,
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          navigate(sellerLinks[newValue].to);
        }}
        sx={{
          minHeight: 60,
        }}
      >
        {sellerLinks.map((link) => (
          <BottomNavigationAction
            key={link.name}
            label={link.name}
            icon={link.icon}
            sx={{
              // Prevent text wrapping
              "& .MuiBottomNavigationAction-label": {
                whiteSpace: "nowrap",
                fontSize: "0.75rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
              minWidth: 0, // allow 4 items to fit
              maxWidth: "25%", // divide equally
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
