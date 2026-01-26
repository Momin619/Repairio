"use client";
import React from "react";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 2,
          backgroundColor: theme === "dark" ? "#1c1c1c" : "#f9f9f9",
          color: theme === "dark" ? "#fff" : "#111",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Theme
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Current theme: <strong className="capitalize">{theme}</strong>
          </Typography>
          <Button
            variant="contained"
            onClick={toggleTheme}
            sx={{
              backgroundColor: theme === "dark" ? "#fff" : "#111",
              color: theme === "dark" ? "#111" : "#fff",
              "&:hover": {
                backgroundColor: theme === "dark" ? "#f0f0f0" : "#333",
              },
            }}
          >
            Switch to {theme === "dark" ? "Light" : "Dark"} Theme
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
