import { useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { AuthContext } from "./contexts/AuthContext";

const featureCards = [
  {
    title: "Create Blogs",
    description: "Write and share your thoughts with a global audience.",
  },
  {
    title: "Connect with Others",
    description: "Engage with like-minded individuals and grow your network.",
  },
  {
    title: "Easy to Use",
    description: "Enjoy a seamless and intuitive blogging experience.",
  },
];

export default function LandingPage({ openRegisterDialog }) {
  const navigate = useNavigate();
  const { isAuthenticated, updateUserInfo } = useContext(AuthContext);
  const theme = useTheme();
  // const [loginOpen, setLoginOpen] = useState(false);
  // const [registerOpen, setRegisterOpen] = useState(false);

  const commonButtonStyles = {
    textTransform: "none",
    fontWeight: "bold",
    px: 4,
    py: 1.5,
    fontSize: "1rem",
  };

  const cardStyles = {
    textAlign: "center",
    boxShadow: 3,
    "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
    transition: "transform 0.3s ease-in-out",
    borderRadius: 2,
  };

  useEffect(() => {
    const token = extractOAuth2TokenFromUrl();
    if (token) {
      getUserInfo(token);
    }
  }, []);

  // Function to extract OAuth2 temporary token from URL
  const extractOAuth2TokenFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  };

  const getUserInfo = async (token) => {
    try {
      const response = await fetch(
        `/api//oauth2-success/jwt-token?token=${token}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        updateUserInfo(data);
        navigate("/home");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // const handleChangeFromRegisterToLogin = () => {
  //   setRegisterOpen(false);
  //   setLoginOpen(true);
  // };

  // const handleChangeFromLoginToRegister = () => {
  //   setRegisterOpen(true);
  //   setLoginOpen(false);
  // };

  // const handleRegisterClickOpen = () => {
  //   setRegisterOpen(true);
  // };

  // const handleRegisterClose = () => {
  //   setRegisterOpen(false);
  // };
  // const handleLoginClose = () => {
  //   setLoginOpen(false);
  // };

  return (
    <Box
      sx={{ backgroundColor: "background.body" }}
      // sx={{
      //   background: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.secondary.dark})`,
      // }}
    >
      {/* Hero Section */}
      {/* <RegisterDialog
        open={registerOpen}
        onClose={handleRegisterClose}
        onChangeLogin={handleChangeFromRegisterToLogin}
      />
      <LoginDialog open={loginOpen} onClose={handleLoginClose} onChangeRegister={handleChangeFromLoginToRegister}/> */}

      <Box sx={{ py: 12, textAlign: "center" }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{ fontSize: { xs: "2.5rem", md: "4rem" } }}
          >
            Welcome to Blogify
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              fontSize: { xs: "1rem", md: "1.25rem" },
              color: "text.primary",
            }}
          >
            Share your thoughts, connect with others, and explore amazing blogs
            from around the world.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              ...commonButtonStyles,
              background: `linear-gradient(135deg, #670678, #d80a77)`,
              color: "white",
              "&:hover": {
                background: `linear-gradient(135deg, #8b0422, #590678)`,
              },
            }}
            onClick={() =>
              isAuthenticated ? navigate("/home") : openRegisterDialog()
            }
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10 }}>
        <Container>
          <Typography
            variant="h4"
            fontWeight="bold"
            align="center"
            gutterBottom
            color="secondary"
            sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
          >
            Why Choose Blogify?
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              mb: 6,
              color: "secondary",
              fontSize: { xs: "0.9rem", md: "1.1rem" },
            }}
          >
            Discover the features that make Blogify the best platform for
            bloggers.
          </Typography>
          <Grid container spacing={4} flex={1} justifyContent="center">
            {featureCards.map((card, index) => (
              <Grid
                key={index}
                sx={{
                  gridColumn: {
                    xs: "span 12", // Full width on small screens
                    sm: "span 6", // Half width on medium screens
                    md: "span 4", // One-third width on large screens
                  },
                }}
              >
                <Card sx={cardStyles}>
                  <CardContent>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ color: theme.palette.primary.light }}
                    >
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="primary.text">
                      {card.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 8, textAlign: "center" }}>
        <Container>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
          >
            Ready to Start Your Blogging Journey?
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 4,
              fontSize: { xs: "0.9rem", md: "1.1rem" },
              color: "text.primary",
            }}
          >
            Join Blogify today and share your voice with the world.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              ...commonButtonStyles,
              background: `linear-gradient(135deg, #56ddbb, #0c8888)`,
              color: "black",
              "&:hover": {
                background: `linear-gradient(135deg, #6ee2b9, #07e3e3)`,
              },
            }}
            onClick={openRegisterDialog}
          >
            Sign Up Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
