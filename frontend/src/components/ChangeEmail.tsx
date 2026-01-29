import { useAuth } from "@/contexts/AuthContext";
import apiErrorHandle, { type APIError } from "@/util/APIErrorHandle";
import { useState } from "react";
import toast from "react-hot-toast";
import Dialog from "./Dialog";
import { getCurrentUser, sendChangeEmailOTP, verifyChangeEmailRequest } from "@/util/api-request/UserUtil";
import type { DialogProps } from "@/types/DialogProps";

export default function ChangeEmail({ isOpen, onClose, onSuccess }: DialogProps) {
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const { saveUserInfoToState, removeCreds } = useAuth();
  const [otp, setOTP] = useState("");

  const handleVerifyClick = async () => {
    setLoading(true);
    const loadingId = toast.loading("Verifying...");
    try {
      const result = await verifyChangeEmailRequest(otp);
      toast.success(result);
      const response = await getCurrentUser();
      saveUserInfoToState(response);
      onSuccess?.();
      reset();

    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    } finally {
      toast.dismiss(loadingId);
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    if (!currentEmail.trim() || !updatedEmail.trim() || !password.trim()) {
      toast.error("Please fill all the fields");
      return;
    }
    setLoading(true);
    const loadingId = toast.loading("Sending OTP...");
    try {
      const result = await sendChangeEmailOTP(currentEmail, updatedEmail, password)
      toast.success(result);
      setIsVerificationEmailSent(true);
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    } finally {
      toast.dismiss(loadingId);
      setLoading(false);
    }
  };

  const reset = () => {
    setUpdatedEmail("");
    setCurrentEmail("");
    setPassword("");
    setOTP("");
    setIsVerificationEmailSent(false);
    onClose();
  }

  return (
    <Dialog isOpen={isOpen} onClose={reset} title={"Update Email"} outsideClickCloses={false}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ">
            Current Email
          </label>
          <input
            id="email"
            type="email"
            value={currentEmail}
            disabled={isVerificationEmailSent}
            onChange={(e) => setCurrentEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-500 rounded-lg mb-4
           bg-white dark:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-600 disabled:dark:text-gray-400"
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            disabled={isVerificationEmailSent}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-500 rounded-lg mb-4
           bg-white dark:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-600 disabled:dark:text-gray-400"
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ">
            New Email
          </label>
          <input
            id="email"
            type="email"
            value={updatedEmail}
            disabled={isVerificationEmailSent}
            onChange={(e) => setUpdatedEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-500 rounded-lg mb-2
           bg-white dark:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-600 disabled:dark:text-gray-400"
          />
        </div>

        {isVerificationEmailSent && (
          <div className="mx-auto">
            OTP &nbsp;
            <input
              type="number"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className="px-3 py-2 border border-gray-500 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
        )}

        <button
          onClick={isVerificationEmailSent ? handleVerifyClick : sendOTP}
          disabled={loading}
          className=" bg-blue-600 mx-auto hover:bg-blue-700 disabled:text-gray-400 disabled:bg-blue-900 disabled:cursor-not-allowed
         text-white font-medium py-2 px-4 rounded-full cursor-pointer "
        >
          {isVerificationEmailSent
            ? loading
              ? "Verifying..."
              : "Verify"
            : loading
              ? "Sending OTP..."
              : "Send OTP"}
        </button>
      </div>
    </Dialog>
  );
}
