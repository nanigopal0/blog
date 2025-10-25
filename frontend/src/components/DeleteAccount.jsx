import toast from "react-hot-toast";
import Dialog from "./Dialog";
import { deleteUser } from "@/util/UserUtil";
import apiErrorHandle from "@/util/APIErrorHandle";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useState } from "react";
import axios from "axios";

export default function DeleteAccount({ isOpen, onClose }) {
  const { removeCreds } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [sentOTP, setSentOTP] = useState(false);
  const [otp, setOtp] = useState("");
  
  const handleDeleteAccount = async () => {
    setLoading(true);
    const loadingId = toast.loading("Deleting account...");
    try {
      const result = await deleteUser(otp);
      toast.success(result || "Account deleted successfully");
      removeCreds();
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if(retry) handleDeleteAccount();
    } finally {
      setLoading(false);
      toast.dismiss(loadingId);
    }
  };

  const sendDeleteOTP = async () => {
    setLoading(true);
    const loadingId = toast.loading("Sending OTP...");
    try {
      const response = await axios.get(`/api/user/delete-otp`, {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("OTP sent to your registered email");
        setSentOTP(true);
      }
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if(retry) sendDeleteOTP();
    } finally {
      setLoading(false);
      toast.dismiss(loadingId);
    }
  };

  return (
    <Dialog title={"Delete Account"} isOpen={isOpen} onClose={onClose}>
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
