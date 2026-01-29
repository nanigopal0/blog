import { useState, type FormEvent } from "react";
import Dialog from "./Dialog";
import toast from "react-hot-toast";
import type { DialogProps } from "@/types/DialogProps";
import apiErrorHandle, { type APIError } from "@/util/APIErrorHandle";
import { useAuth } from "@/contexts/AuthContext";
import { resetPasswordWithOTP, sendForgotPasswordOTP } from "@/util/api-request/UserUtil";

export default function ForgotPassword({ isOpen, onClose }: DialogProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSentOTP, setIsSentOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const { removeCreds } = useAuth();

  const sendOTP = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email");
      return;
    }
    const toastId = toast.loading("Sending OTP...");
    setLoading(true);
    try {
      const res = await sendForgotPasswordOTP(email);
      toast.success(res || "OTP sent to your email");
      setIsSentOTP(true);
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  const resetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const toastId = toast.loading("Resetting password...");
    setLoading(true);
    try {
      const response = await resetPasswordWithOTP(email, otp, newPassword);
      toast.success(response || "Password reset successful");
      resetState();
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
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
    onClose();
  };

  return (
    <Dialog title={"Forgot Password"} isOpen={isOpen} onClose={onClose} outsideClickCloses={false}>
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
