import { AuthContext } from "@/contexts/AuthContext";
import apiErrorHandle from "@/util/APIErrorHandle";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import Dialog from "./Dialog";
import { getCurrentUser } from "@/util/UserUtil";

export default function ChangeEmail({ isOpen, onClose }) {
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const { updateUserInfo, removeCreds } = useContext(AuthContext);
  const [otp, setOTP] = useState("");

  const handleVerifyClick = async () => {
    setLoading(true);
    const loadingId = toast.loading("Verifying...");
    try {
      const result = await axios.put(
        "/api/user/verify-update-email",
        {
          email: updatedEmail,
          OTP: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (result.status === 204) {
        toast.success(result.data || "Email updated successfully");
        const response = await getCurrentUser();
        updateUserInfo(response);
        setOTP("");
        onClose();
      }
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) handleVerifyClick();
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
      const result = await axios.post(
        "/api/user/change-email-otp",
        {
          email: currentEmail,
          password: password,
          newEmail: updatedEmail
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (result.status === 200) {
        toast.success(result.data || "OTP sent successfully");
        setIsVerificationEmailSent(true);
      }
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) sendOTP();
    } finally {
      toast.dismiss(loadingId);
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={"Update Email"}>
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
