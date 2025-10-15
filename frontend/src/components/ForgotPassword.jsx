import { useState } from "react";
import Dialog from "./Dialog";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPassword({ isOpen, onclose }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSentOTP, setIsSentOTP] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email");
      return;
    }
    const toastId = toast.loading("Sending OTP...");
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/public/send-forgot-password-otp`,
        email,
        {
          headers: { "Content-Type": "text/plain" },
        }
      );
      if (response.status === 200) {
        toast.success(response.data || "OTP sent to your email");
        setIsSentOTP(true);
      }
    } catch (error) {
      if (error.response.status === 404)
        toast.error(error.response?.data || "User not found");
      else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      )
        toast.error(error.response.data.message);
      else toast.error("Error sending OTP");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const toastId = toast.loading("Resetting password...");
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/public/reset-password`,
        {
          email,
          otp,
          password: newPassword,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        toast.success(response.data || "Password reset successful");
        resetState();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error resetting password");
      }
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  const resetState = () => {
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    onclose();
  };

  return (
    <Dialog title={"Forgot Password"} isOpen={isOpen} onClose={onclose}>
      <div>
        <p className="mb-2">Enter your email</p>
        <form
          className="mb-6 flex items-center gap-4"
          onSubmit={(e) => sendOTP(e)}
        >
          <input
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="border border-gray-500 p-3 rounded-xl flex-1"
          />
          <button
            className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-2xl hover:bg-violet-700"
            type="submit"
            disabled={loading}
          >
            {isSentOTP ? "Resend OTP" : "Send OTP"}
          </button>
        </form>
        {isSentOTP && (
          <form onSubmit={(e) => resetPassword(e)}>
            <div className="flex gap-4 items-center mb-6">
              <p>Enter OTP</p>
              <input
                value={otp}
                disabled={loading}
                onChange={(e) => setOtp(e.target.value)}
                type="number"
                required
                placeholder="000000"
                maxLength={6}
                minLength={6}
                className="border border-gray-500 p-2 rounded-2xl"
              />
            </div>
            <p className="mb-2">New Password</p>

            <input
              disabled={loading}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
              className="border border-gray-500 p-3 rounded-2xl w-full mb-6"
            />

            <p className="mb-2">Re-type Password</p>

            <input
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
              placeholder="Password"
              className="border border-gray-500 p-3 rounded-2xl w-full mb-6"
            />

            <div className="text-center">
              <button
                className="cursor-pointer bg-violet-600 text-white px-4 py-2 rounded-2xl hover:bg-violet-700"
                type="submit"
                disabled={loading}
              >
                Reset Password
              </button>
            </div>
          </form>
        )}
      </div>
    </Dialog>
  );
}
