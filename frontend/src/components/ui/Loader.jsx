import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loader() {
  return (
    <Box
      sx={{
        minHeight: "60vh", // keeps it centered under header
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={48} />
    </Box>
  );
}
