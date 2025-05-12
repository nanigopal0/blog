const ColorPalette = {
  lightMode: {
    background: {
      default: "#FFFFFF", // White background
      paper: "#f5f2f2", // Slightly off-white for cards
    },
    primary: {
      main: "#4A90E2", // Soft Blue
      contrastText: "#FFFFFF", // White text on primary
    },
    secondary: {
      main: "#0acca0", // Mint Green
      contrastText: "#FFFFFF", // White text on secondary
    },
    text: {
      primary: "#333333", // Dark Gray
      secondary: "#9c9595", // Light Gray
    },
    border: "#E0E0E0", // Light Border Gray
  },
  darkMode: {
    background: {
      default: "#1E1E1E", // Dark Gray
      paper: "#333333", //// Slightly lighter gray for cards
    },
    primary: {
      main: "#4A90E2", // Soft Blue
      contrastText: "#FFFFFF", // White text on primary
    },
    secondary: {
      main: "#089676", // Mint Green
      contrastText: "#FFFFFF", // White text on secondary
    },
    text: {
      primary: "#FFFFFF", // White
      secondary: "#9c9595", // Light Gray
    },
    border: "#3A3A3A", // Dark Border Gray
  },
};

export default ColorPalette;
