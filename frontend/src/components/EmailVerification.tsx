import { useState } from "react";
import Dialog from "./Dialog";
import toast from "react-hot-toast";
import type { DialogProps } from "@/types/DialogProps";
import apiErrorHandle, { type APIError } from "@/util/APIErrorHandle";
import { useAuth } from "@/contexts/AuthContext";
import { verifyEmailOTP } from "@/util/api-request/UserUtil";

interface EmailVerificationProps extends DialogProps{
  email: string;
}

export default function EmailVerification({email, isOpen, onClose }: EmailVerificationProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { removeCreds } = useAuth();

  const verifyUser = async () => {
    setLoading(true);
    const toastId = toast.loading("Verifying OTP...");
    try {
      const res = await verifyEmailOTP(otp,email);
      toast.success(res, { id: toastId });
      onClose();
    } catch (error: unknown) {
      apiErrorHandle(error as APIError, removeCreds)
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  const reset = () => {
    setOtp("");
    onClose();
  }

  return (
    <Dialog title={"Email Verification"} isOpen={isOpen} onClose={reset} outsideClickCloses={false}>
      <p className="dark:text-gray-400 text-gray-600">
        Your email id is not verified yet! Verify your email id by entering OTP.
      </p>
      <input
        type="number"
        max={999999}
        disabled={loading}
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="OTP"
        className="border p-2 rounded-xl w-full my-4"
      />
      <button
        className="py-2 px-4 bg-indigo-500 text-white rounded-xl"
        disabled={loading}
        onClick={verifyUser}
      >
        Verify
      </button>
    </Dialog>
  );
}
