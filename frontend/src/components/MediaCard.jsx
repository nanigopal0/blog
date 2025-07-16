import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Avatar, Box, Chip, IconButton } from "@mui/material";
import { GenerateRandomColor } from "../util/GenerateRandomColor";
import { useNavigate } from "react-router-dom";
import htmlTruncate from 'html-truncate';
import truncate from "html-truncate";

export default function MediaCard({ blog }) {
  const navigate = useNavigate();


  const truncateHtmlContent = (htmlContent, maxLength = 80) => {
    return htmlTruncate(htmlContent, maxLength, { ellipsis: "..." });
  };
  const navigateReader = (id) => {
    navigate(`/blog/${id}`)
  };

 
  return (
    <Card
      sx={{
        maxWidth: 400,
        minWidth: 300,
        width: "100%",
        backgroundColor: "background.body",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.05)", // Slightly enlarge the card
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)", // Add a shadow effect
        },
      }}
      onClick={() => navigateReader(blog.id)}
    >
      {/* Blog Cover Image */}
      <CardMedia
        sx={{ height: 180 }}
        image={blog.coverImage}
        title={blog.title}
      />

      {/* Blog Content */}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {blog.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
          dangerouslySetInnerHTML={{
            __html: truncateHtmlContent(blog.content),
          }}
        ></Typography>
      </CardContent>

      {/* Blog Footer */}
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            sx={{ bgcolor: GenerateRandomColor(), width: 32, height: 32 }}
            aria-label="recipe"
          >
            {blog.userFullName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {blog.userFullName}
            </Typography>
            <Typography variant="caption" sx={{ color: "gray" }}>
              {new Date(blog.time).toLocaleDateString("en-us", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={blog.category?.category || "Uncategorized"}
          sx={{
            backgroundColor: "#e0f7fa",
            color: "#00796b",
            fontWeight: "bold",
            fontSize: "0.8rem",
          }}
        />
      </CardActions>
    </Card>
  );
}