import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { AuthContext } from "../contexts/AuthContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
  alpha,
  Button,
  ButtonBase,
  InputAdornment,
  ListItemIcon,
  TextField,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import SearchDialog from "./SearchDialog";
import { ThemeContext } from "../contexts/ThemeContext";

export default function NavBar({ openLoginDialog }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { isAuthenticated, logout } = React.useContext(AuthContext);
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const { darkMode, toggleTheme } = React.useContext(ThemeContext);
  const theme = useTheme();

  const isActive = (path) => location.pathname === path; // Check if the tab is active

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);

  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    navigate("/settings");
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
         
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {isAuthenticated ? (
        <>
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleSettingsClick}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem onClick={handleMenuClose}>Login</MenuItem>
          <MenuItem onClick={handleMenuClose}>Signup</MenuItem>
        </>
      )}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          // color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const [open, setOpen] = React.useState(false); // State to manage the search dialog
  const openSearch = () => setOpen(true); // Open the search dialog
  const handleClose = () => setOpen(false); // Close the search dialog

  const handleSearchSubmit = (keyword) => {
    setSearchKeyword(keyword); // Update the search keyword state
    handleClose(); // Close the dialog after submission
    navigate(`/search?query=${keyword}`); // Navigate to the search page with the keyword
  };

  return (
    <Box sx={{ flexGrow: 1}} >
      <AppBar position="static" color="primary">
        <SearchDialog
          open={open}
          handleClose={handleClose}
          onSearchSubmit={handleSearchSubmit}
        />

        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            // color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: { xs: "block", sm: "none", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <ButtonBase
            sx={{ display: { xs: "none", sm: "block" } }}
            onClick={() => navigate("/")}
          >
            <Typography variant="h6" noWrap component="div" fontWeight={600}>
              Blogify
            </Typography>
          </ButtonBase>

          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..." // Show placeholder only when expanded
            value={searchKeyword}
            hidden={!isAuthenticated} // Disable when not authenticated
            onClick={openSearch}
            sx={{
              transition: "width 0.3s ease, background-color 0.3s ease",
              backgroundColor: alpha("#ffffff", 0.4), // Contrasting background

              marginLeft: 2, // Add margin for spacing
              "&:hover": {
                backgroundColor: alpha("#ffffff", 0.25), // Slightly darker on hover
              },
              "& .MuiOutlinedInput-root": {
                paddingRight: 0, // Remove extra padding
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent", // Remove border
              },
              "& .MuiOutlinedInput-input": {
                padding: "8px 12px", // Add padding for better spacing
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ flexGrow: 1 }} />

          <ButtonBase
            hidden={!isAuthenticated}
            sx={{
              display: { xs: "none", sm: "block" },
              marginRight: 4,
              backgroundColor: isActive("/dashboard")
                ? "rgba(255, 255, 255, 0.2)"
                : "transparent",
              borderRadius: 2,
              padding: "6px 12px",
            }}
            onClick={() => navigate("/dashboard")}
          >
            <Typography
              variant="h6"
              fontSize={20}
              noWrap
              component="div"
        
              fontWeight={500}
            >
              Dashboard
            </Typography>
          </ButtonBase>

          <ButtonBase
            hidden={!isAuthenticated}
            sx={{
              display: { xs: "none", sm: "block" },
              marginRight: 4,
              backgroundColor: isActive("/create-blog")
                ? "rgba(255, 255, 255, 0.2)"
                : "transparent",
              borderRadius: 2,
              padding: "6px 12px",
            }}
            onClick={() => navigate("/create-blog")}
          >
            <Typography
              variant="h6"
              fontSize={20}
              noWrap
             
              component="div"
              fontWeight={500}
            >
              Post
            </Typography>
          </ButtonBase>

          <ButtonBase
            sx={{
              display: { xs: "none", sm: "block" },
              marginRight: 3,
              backgroundColor: isActive("/about")
                ? "rgba(255, 255, 255, 0.2)"
                : "transparent",
              borderRadius: 2,
              padding: "6px 12px",
            }}
            onClick={() => navigate("/about")}
          >
            <Typography
              variant="h6"
              fontSize={20}
              noWrap
   
              component="div"
              fontWeight={500}
            >
              About
            </Typography>
          </ButtonBase>

          <Box marginRight={3}>
            <IconButton
              hidden={!isAuthenticated}
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>

            <Button
              variant="outlined"
              color="inherit"
              hidden={isAuthenticated}
              sx={{
                display: { xs: "none", sm: "block" },
                marginRight: 3,
                fontSize: 18,
                borderRadius: 2,
                backgroundColor: "#7f03fc",
                ":hover": {
                  backgroundColor: "#8013bf",
                },
              }}
              onClick={openLoginDialog}
            >
              Login
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="#ffffff" onClick={toggleTheme}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
