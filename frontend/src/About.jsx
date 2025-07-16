import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

function About() {
  return (
    
      <Card
        sx={{
          width: "100%",
          p: 3,
          boxShadow: 4,
          borderRadius: 2,
          backgroundColor: "background.body",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              About us
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "justify", mb: 2 }}>
              Welcome to our Blog Platform! This application is designed to
              provide a seamless and user-friendly experience for sharing ideas,
              stories, and knowledge. Whether you're a writer, a reader, or
              someone looking for inspiration, this platform is built to
              connect people through the power of words.
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "justify", mb: 2 }}>
              Our goal is to create a space where creativity thrives, and
              individuals can express themselves freely. With features like
              customizable profiles, rich text editing, and a vibrant community,
              this platform is your go-to destination for blogging.
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "justify" }}>
              Thank you for being a part of this journey. We are constantly
              working to improve and add new features to enhance your
              experience. Stay tuned for updates, and feel free to share your
              feedback with us!
            </Typography>
          </Box>
        </CardContent>
      </Card>
 
  );
}

export default About;