import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import FormatDate from "../util/FormatDate";

function Comment({ photo, name, time, text }) {
   
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        mb: 3,
        p: 2,
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Avatar
        src={photo}
        alt={name}
        sx={{ width: 40, height: 40, mr: 2 }}
      />
      <Box>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: "gray", mb: 1 }}>
          {FormatDate( time)}
        </Typography>
        <Typography variant="body2">{text}</Typography>
      </Box>
    </Box>
  );
}

export default Comment;