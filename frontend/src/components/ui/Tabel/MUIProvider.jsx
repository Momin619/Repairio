import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "../../../context/ThemeContext";

export default function MUIProvider({ children }) {
  const { theme } = useTheme();

  const muiTheme = createTheme({
    palette: {
      mode: theme, // "light" or "dark"
      background: {
        default: theme === "dark" ? "#121212" : "#f5f5f5",
        paper: theme === "dark" ? "#1e1e1e" : "#ffffff",
      },
    },
  });

  return (
    <MUIThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
