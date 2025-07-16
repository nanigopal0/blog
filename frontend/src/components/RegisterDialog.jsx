import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  LinearProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  emailValidate,
  passwordValidate,
} from "../util/RegisterInputValidate";

export default function RegisterDialog({ open, onClose, onChangeLogin }) {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [time, setTime] = useState(5);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    formJson.name = formJson.fullName;
    delete formJson.fullName; // Remove the fullName key from the object

    serverRegister(formJson)
      .then((result) => {
        if (result.status == 201) {
          setErrorMessage(null);
          console.log(result);
          setIsRegisterSuccess(true);
          timer(time);
        } else throw new Error("Registration failed. Please try again.");
      })
      .catch((error) => {
        setErrorMessage(error.message || "An unknown error occurred.");
        console.error("There has been a problem with fetch operation:", error);
      })
      .finally(setLoading(false));
  };

  const serverRegister = async (data) => {
    const result = await fetch(`/api/public/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  
    if (!result.ok) {
      throw new Error(await result.text() || "Invalid credentials");
    }
    return result;
  };

  const timer = async (timeOut) => {
    let countdown = timeOut;
    const interval = setInterval(() => {
      if (countdown <= 0) {
        clearInterval(interval);
        onChangeLogin();
        return;
      }
      setTime((val) => val - 1);
      countdown--;
    }, 1000);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setIsPasswordValid(passwordValidate(event.target.value));
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setIsEmailValid(emailValidate(event.target.value));
  };

  // Reset all fields to their initial state
  const resetFields = () => {
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLoading(false);
    setErrorMessage(null);
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsPasswordValid(false);
    setIsEmailValid(false);
    setIsRegisterSuccess(false);
    setTime(5);
  };

  // Handle dialog close
  const handleClose = () => {
    resetFields(); // Reset all fields
    onClose(); // Call the parent onClose handler
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
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "background.body",
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
          Sign Up
        </Typography>
      </DialogTitle>

      <DialogContent>
        {isRegisterSuccess && (
          <Alert severity="success" >
            Successfully registered! Login to access Blogify. Redirect to Login
            in {time}s
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" >
            {errorMessage}
          </Alert>
        )}
        {/* Full Name Input */}
        <TextField
          autoFocus
          required
          onChange={handleFullNameChange}
          value={fullName}
          error={fullName.length < 3 && fullName != ""}
          size="small"
          margin="normal"
          id="fullName"
          multiline={false}
          name="fullName"
          label="Full Name"
          type="text"
          variant="outlined"
          fullWidth
        />

        {/* Email Input */}
        <TextField
          required
          onChange={handleEmailChange}
          value={email}
          error={!isEmailValid && email != ""}
          size="small"
          margin="normal"
          id="email"
          name="email"
          multiline={false}
          label="Email Address"
          type="email"
          variant="outlined"
          fullWidth
        />

        {/* Password Input with Eye Icon */}
        <TextField
          required
          size="small"
          value={password}
          onChange={handlePasswordChange}
          error={!isPasswordValid && password != ""}
          margin="normal"
          id="password"
          multiline={false}
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"} // Toggle between text and password
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

        {/* Confirm Password Input with Eye Icon */}
        <TextField
          required
          size="small"
          margin="normal"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={password != confirmPassword}
          id="confirmPassword"
          name="confirmPassword"
          multiline={false}
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
          variant="outlined"
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
                    edge="end"
                    aria-label="toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Terms and Conditions */}
        <DialogContentText
          align="left"
          variant="body2"
          color="text.primary"
          sx={{ marginTop: 2 }}
        >
          By signing up, you agree to our <strong>Terms of Service</strong> and{" "}
          <strong>Privacy Policy</strong>.
        </DialogContentText>
        {/* Register Button */}
        <Button
          type="submit"
          variant="contained"
          sx={{ marginTop: 4 }}
          fullWidth
          aria-label="Register"
          disabled={
            !isEmailValid ||
            !isPasswordValid ||
            confirmPassword !== password ||
            loading
          }
        >
          Register
        </Button>

        {/* Login Section */}
        <Typography sx={{ marginTop: 2, marginBottom: 4 }} align="center">
          Already have an account?{" "}
          <Button
            sx={{ textTransform: "none", fontWeight: "600", color: "primary.main" }}
            onClick={onChangeLogin}
            variant="text"
            aria-label="Login"
          >
            Login
          </Button>
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
