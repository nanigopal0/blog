import { useState } from "react";
import { emailValidate, passwordValidate } from "../util/RegisterInputValidate";
import { Eye, EyeOff } from "lucide-react";
import Dialog from "./Dialog";
import LoadingIndicator from "./LoadingIndicator";
import axios from "axios";
import toast from "react-hot-toast";
import EmailVerification from "./EmailVerification";

export default function RegisterDialog({ open, onClose, onChangeLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [verificationNeeded, setVerificationNeeded] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    formJson.name = formJson.fullName;
    delete formJson.fullName; // Remove the fullName key from the object

    serverRegister(formJson);
  };

  const serverRegister = async (data) => {
    try {
      const result = await axios.post(`/api/public/signup`, data, {
        headers: { "Content-Type": "application/json" },
      });
      setErrorMessage(null);
      toast.success(result.data);
      setIsRegisterSuccess(true);
      setVerificationNeeded(true);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "An unknown error occurred while register"
      );
      toast.error(
        error.response?.data?.message || error.message || "Error Register"
      );
    } finally {
      setLoading(false);
    }
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
  };

  // Handle dialog close
  const handleClose = () => {
    resetFields(); // Reset all fields
    onClose(); // Call the parent onClose handler
  };

  if (!open) return null;

  return (
    <Dialog isOpen={open} onClose={handleClose} title={"Register to Blogify"}>
    <EmailVerification email={email} isOpen={verificationNeeded} onclose={()=>setVerificationNeeded(false)}/>
      <div>
        {loading && <LoadingIndicator />}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 ">
          {isRegisterSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              Successfully registered! Verify your email to login.
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {errorMessage}
            </div>
          )}

          {/* Full Name Input */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium mb-2"
            >
              Full Name
            </label>
            <input
              autoFocus
              required
              onChange={handleFullNameChange}
              value={fullName}
              id="fullName"
              name="fullName"
              type="text"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                fullName.length < 3 && fullName !== ""
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              required
              onChange={handleEmailChange}
              value={email}
              id="email"
              name="email"
              type="email"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                !isEmailValid && email !== ""
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input with Eye Icon */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                required
                value={password}
                onChange={handlePasswordChange}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isPasswordValid && password !== ""
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 cursor-pointer right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Input with Eye Icon */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  password !== confirmPassword && confirmPassword !== ""
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 cursor-pointer pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-4">
            By signing up, you agree to our{" "}
            <span className="font-semibold">Terms of Service</span> and{" "}
            <span className="font-semibold">Privacy Policy</span>.
          </p>

          {/* Register Button */}
          <button
            type="submit"
            disabled={
              !isEmailValid ||
              !isPasswordValid ||
              confirmPassword !== password ||
              loading
            }
            className="w-full bg-purple-600  py-2 px-4 rounded-md hover:bg-purple-700 
            focus:outline-none focus:ring-2 focus:purple-500 focus:ring-offset-2 text-white
            disabled:opacity-30 disabled:cursor-not-allowed transition-colors mt-6 cursor-pointer"
          >
            Register
          </button>

          {/* Login Section */}
          <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-4 mb-0">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onChangeLogin}
              className="dark:text-blue-400 text-violet-500 cursor-pointer hover:text-violet-600 font-semibold focus:outline-none focus:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </Dialog>
  );
}
