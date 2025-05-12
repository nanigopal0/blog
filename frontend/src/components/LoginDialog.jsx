import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Box,
  LinearProgress,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { emailValidate, passwordValidate } from "../util/RegisterInputValidate";
import { API_BASE_URL } from "../util/BaseUrl";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginDialog({ open, onClose, onChangeRegister }) {
  const navigate = useNavigate();
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { login,logout, updateUserInfo } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    // console.log("Log in:", formJson);

    serverLogin(formJson)
      .then((result) => {
        saveResponseLocally(result);
        setLoading(false);
        // setErrorMessage(null);
        onClose(); // Close the dialog after successful login
        navigate("/home");
      })
      .catch((error) => {
        setErrorMessage(error.message || "An unknown error occurred.");
        setLoading(false);
        console.error("There has been a problem with fetch operation:", error);
      });
  };

  const serverLogin = async (data) => {
    const result = await fetch(`${API_BASE_URL}/public/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!result.ok) {
      throw new Error(await result.text() || "Invalid credentials");
    }
    if (result.status == 401) logout();
    return await result.json();
  };

  const saveResponseLocally = (resultData) => {
    updateUserInfo(resultData);
    login();
  };

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    setIsPasswordValid(passwordValidate(password));
  };

  const handleEmailChange = (event) => {
    const email = event.target.value;
    setIsEmailValid(emailValidate(email));
  };

  const resetAllField = () => {
    setIsPasswordValid(false);
    setIsEmailValid(false);
    setErrorMessage(null);
    setLoading(false);
    setShowPassword(false);
  };

  const handleClose = () => {
    resetAllField();
    onClose();
  };

  return (
    <Dialog
      maxWidth="xs"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit,
        },
      }}
    >
      <LinearProgress hidden={!loading} />
      <DialogTitle>
        <Typography
          variant="h6"
          component="div"
          align="center"
          fontWeight="700"
          sx={{ flexGrow: 1 }}
        >
          Sign in
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Alert severity="error" hidden={!errorMessage}>
          {errorMessage}
        </Alert>
        {/* Email Input */}
        <TextField
          autoFocus
          required
          size="small"
          margin="normal"
          onChange={handleEmailChange}
          multiline={false}
          id="email"
          name="email"
          label="Email Address"
          type="email"
          variant="outlined"
          fullWidth
        />

        {/* Password Input */}
        <TextField
          required
          size="small"
          margin="normal"
          id="password"
          multiline={false}
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"} // Toggle between text and password
          onChange={handlePasswordChange}
          error={!isPasswordValid && errorMessage != null}
          variant="outlined"
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Forgot Password Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 1 }}>
          <Button
            onClick={() => navigate("/forgot-password")}
            color="primary"
            sx={{ textTransform: "none" }}
            aria-label="Forgot Password"
          >
            Forgot password?
          </Button>
        </Box>

        {/* Terms and Conditions */}
        <DialogContentText
          component="div"
          align="left"
          fontSize={14}
          sx={{ marginTop: 2 }}
        >
          By signing in, you agree to our <strong>Terms of Service</strong> and{" "}
          <strong>Privacy Policy</strong>.
        </DialogContentText>

        {/* Login Button */}
        <Button
          disabled={!isPasswordValid || !isEmailValid || loading}
          type="submit"
          variant="contained"
          sx={{ marginTop: 4 }}
          fullWidth
          aria-label="Login"
        >
          Login
        </Button>

        {/* Register Section */}
        <Typography sx={{ marginTop: 2, marginBottom: 4 }} align="center">
          Don't have an account?{" "}
          <Button
            sx={{ textTransform: "none", fontWeight: "600" }}
            onClick={onChangeRegister}
            color="primary"
            aria-label="Register"
          >
            Register
          </Button>
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
