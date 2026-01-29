import toast from "react-hot-toast";
import Dialog from "./Dialog";
import { deleteUser, sendDeleteAccountOTP } from "@/util/api-request/UserUtil";
import apiErrorHandle from "@/util/APIErrorHandle";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import type { DialogProps } from "@/types/DialogProps";
import type { APIError } from "@/util/APIErrorHandle";

export default function DeleteAccount({ isOpen, onClose }: DialogProps) {
  const { removeCreds } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sentOTP, setSentOTP] = useState(false);
  const [otp, setOtp] = useState("");

  const handleDeleteAccount = async () => {
    setLoading(true);
    const loadingId = toast.loading("Deleting account...");
    try {
      await deleteUser(otp);
      toast.success("Account deleted successfully");
      removeCreds();
      reset();
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);

    } finally {
      setLoading(false);
      toast.dismiss(loadingId);
    }
  };

  const sendDeleteOTP = async () => {
    setLoading(true);
    const loadingId = toast.loading("Sending OTP...");
    try {
      const response = await sendDeleteAccountOTP();
      toast.success(response || "OTP sent to your registered email");
      setSentOTP(true);
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);

    } finally {
      setLoading(false);
      toast.dismiss(loadingId);
    }
  };

  const reset = () => {
    setSentOTP(false);
    setOtp("");
    onClose();
  }

  return (
    <Dialog title={"Delete Account"} isOpen={isOpen} onClose={reset} outsideClickCloses={false}>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        This action cannot be undone, please verify your email to proceed with
        account deletion.
      </p>
      <button
        onClick={sendDeleteOTP}
        disabled={loading}
        className="bg-green-600 mb-6 text-white px-4 py-2 rounded-lg cursor-pointer disabled:opacity-50"
      >
        {sentOTP ? "Resend OTP" : "Send OTP"}
      </button>
      {sentOTP && (
        <>
          <div className="mb-6 flex items-center gap-4">
            <p>Enter OTP</p>
            <input
              disabled={loading}
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              className="p-3 rounded-xl border flex-1"
              maxLength={6}
            />
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Verify & Delete Account
          </button>
        </>
      )}
    </Dialog>
  );
}
