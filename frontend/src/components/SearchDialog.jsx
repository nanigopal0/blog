import { Search } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, {  } from "react";

export default function SearchDialog({ open, handleClose, onSearchSubmit }) {
  const [searchKeyword, setSearchKeyword] = React.useState("");


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearchSubmit(searchKeyword); // Submit the search keyword
    }
  };



  return (
    <>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        onClose={handleClose}
        sx={{
          position: "absolute",
          top: "-85%",
        }}
      >
        <DialogContent>
          <TextField
            autoFocus
            autoCorrect="true"
            autoComplete="on"
            multiline={false}
            variant="outlined"
            onKeyDown={handleKeyDown}
            size="small"
            placeholder="Search..." // Show placeholder only when expanded
            fullWidth
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label="search icon"
                      onClick={()=>onSearchSubmit(searchKeyword)}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
