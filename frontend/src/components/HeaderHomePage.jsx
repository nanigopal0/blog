import { Box, Typography, ButtonBase, useTheme } from "@mui/material";

export default function HeaderHomePage({ name, onClick }) {
  const theme = useTheme();
  return (
    <ButtonBase
      onClick={onClick} 
      sx={{
        display: "inline-block",
        background: theme.palette.secondary.main, // Gradient background
        color: theme.palette.text.primary, // Text color
        borderRadius: "18px", // Fully rounded pill shape
        padding: "8px 10px", // Padding for better spacing
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow
        transition: "transform 0.3s, box-shadow 0.3s", // Smooth hover effect
        "&:hover": {
          transform: "scale(1.1)", // Slightly enlarge on hover
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)", // Stronger shadow on hover
        },
      }}
    >
      <Typography
        // variant="body1"
        sx={{
          fontWeight: "medium",
          textTransform: "capitalize", // Capitalize the header name
          textAlign: "center",
        }}
      >
        {name}
      </Typography>
    </ButtonBase>
  );
}