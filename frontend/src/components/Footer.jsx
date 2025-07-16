import React from "react";
import { Box, Typography, Grid, Link, IconButton, Container } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles"; // Import the theme hook

export default function Footer() {
  const theme = useTheme(); // Access the Material-UI theme

  return (
    <Box
      sx={{
        backgroundColor: "black", // Use primary color from the theme
        color: "white",
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              About Blogify
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
              Blogify is your go-to platform for sharing ideas, connecting with
              others, and exploring amazing blogs from around the world.
            </Typography>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link href="/" color="inherit" underline="hover" sx={{ display: "block", mb: 1 }}>
                Home
              </Link>
              <Link href="/about" color="inherit" underline="hover" sx={{ display: "block", mb: 1 }}>
                About Us
              </Link>
              <Link href="/contact" color="inherit" underline="hover" sx={{ display: "block", mb: 1 }}>
                Contact
              </Link>
              <Link href="/privacy" color="inherit" underline="hover" sx={{ display: "block", mb: 1 }}>
                Privacy Policy
              </Link>
            </Box>
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton
                href="https://facebook.com"
                target="_blank"
                rel="noopener"
                sx={{ color: "white" }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                href="https://twitter.com"
                target="_blank"
                rel="noopener"
                sx={{ color: "white" }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                href="https://instagram.com"
                target="_blank"
                rel="noopener"
                sx={{ color: "white" }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                href="https://linkedin.com"
                target="_blank"
                rel="noopener"
                sx={{ color: "white" }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
            © {new Date().getFullYear()} Blogify. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}