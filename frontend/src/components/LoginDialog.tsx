import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { emailValidate, passwordValidate } from "../util/RegisterInputValidate";
import Dialog from "./Dialog";
import LoadingIndicator from "./LoadingIndicator";
import axios from "axios";
import toast from "react-hot-toast";
import ForgotPassword from "./ForgotPassword";
import EmailVerification from "./EmailVerification";
import type { DialogProps } from "@/types/DialogProps";
import apiErrorHandle, { type APIError } from "@/util/APIErrorHandle";

interface LoginDialogProps extends DialogProps {
  onChangeRegister: () => void;
}

type LoginData = {
  email: string;
  password: string;
};

export default function LoginDialog({
  isOpen,
  onClose,
  onChangeRegister,
}: LoginDialogProps) {
  const navigate = useNavigate();
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { saveUserInfoToState } = useAuth();
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [verificationNeeded, setVerificationNeeded] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setErrorMessage(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const loginData: LoginData = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    };

    // Important: ensures EmailVerification gets the submitted email
    setEmail(loginData.email);

    try {
      await serverLogin(loginData);
    } finally {
      setLoading(false);
    }
  };

  const serverLogin = async (data: LoginData) => {
    try {
      const response = await axios.post(`/api/public/login`, data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      saveUserInfoToState(response.data);
      toast.success("Login Successful");
      onClose();
      navigate("/home");
    } catch (error) {
      const apiError = error as APIError;
      console.log(apiError);
      if (apiError.status === 403) {
        setVerificationNeeded(true);
        setLoading(false);
        return;
      }
      apiErrorHandle(apiError, () => { });
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setIsPasswordValid(passwordValidate(password));
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setEmail(email);
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

  const googleSignIn = async () => {
    window.location.href = "/api/public/login/google";
  };

  if (!isOpen) return null;

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title={"Login to Blogify"} outsideClickCloses={false}>
      <ForgotPassword
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
      <EmailVerification
        email={email}
        isOpen={verificationNeeded}
        onClose={() => setVerificationNeeded(false)}
      />
      <div className="p-4">
        {loading && <LoadingIndicator />}

        {/* <div className="flex items-center justify-center mb-4 text-yellow-600">
          <AlertCircle size={16} className="mr-2" />
          <span className="text-sm">Enable Cookie to use this application</span>
        </div> */}

        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          <input
            className="mx-auto w-full border p-2 my-6 border-gray-400 rounded-lg  "
            onChange={handleEmailChange}
            id="email"
            name="email"
            placeholder="Email Address"
            type="email"
            required
          />

          <input
            className="mx-auto w-full border border-gray-400 rounded-lg mb-4 p-2 "
            required
            id="password"
            name="password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            onChange={handlePasswordChange}
          />

          {/* Forgot Password Button */}
          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={() => setIsForgotPasswordOpen(true)}
              className="text-violet-500 font-medium text-sm hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Terms and Conditions */}
          <p className="text-left text-sm mt-2 ">
            By signing in, you agree to our <strong>Terms of Service</strong>{" "}
            and <strong>Privacy Policy</strong>.
          </p>

          {/* Login Button */}
          <button
            className="w-full mt-4 cursor-pointer bg-purple-600 p-2 rounded-2xl text-white font-medium disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={!isPasswordValid || !isEmailValid || loading}
            type="submit"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Section */}
        <p className="mt-2 mb-4 text-center ">
          Don't have an account?{" "}
          <button
            type="button"
            className="font-medium text-violet-500 cursor-pointer mt-4"
            onClick={onChangeRegister}
          >
            Register
          </button>
        </p>

        <p className="text-center text-sm ">Or continue with</p>

        <div className="text-center mb-2 flex justify-center items-center gap-2 mt-4">
          <button
            type="button"
            onClick={googleSignIn}
            className="flex items-center  justify-center w-full p-2 bg-blue-600/10  rounded-lg cursor-pointer "
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </Dialog>
  );
}
