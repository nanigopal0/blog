import { Box, Typography, ButtonBase } from "@mui/material";

export default function HeaderHomePage({ name, onClick }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        display: "inline-block",
        background: "linear-gradient(135deg, #1976d2, #42a5f5)", // Gradient background
        color: "white",
        borderRadius: "25px", // Fully rounded pill shape
        padding: "10px 20px", // Padding for better spacing
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow
        transition: "transform 0.3s, box-shadow 0.3s", // Smooth hover effect
        "&:hover": {
          transform: "scale(1.1)", // Slightly enlarge on hover
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)", // Stronger shadow on hover
        },
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: "bold",
          textTransform: "capitalize", // Capitalize the header name
          textAlign: "center",
        }}
      >
        {name}
      </Typography>
    </ButtonBase>
  );
}