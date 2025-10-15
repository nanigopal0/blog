import { useState } from "react";
import Dialog from "./Dialog";
import toast from "react-hot-toast";
import axios from "axios";

export default function EmailVerification({ email, isOpen, onclose }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyUser = async () => {
    setLoading(true);
    const toastId = toast.loading("Verifying OTP...");
    try {
      const response = await axios.put(
        `/api/public/verify-email`,
        { email: email, OTP: otp },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        toast.success("Email verified successfully");
        onclose();
      }
    } catch (error) {
      if (error.response.status === 400)
        toast.error(error.response?.data || "Invalid OTP");
      else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      )
        toast.error(error.response.data.message);
      else toast.error("Error verifying OTP");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };
  return (
    <Dialog title={"Email Verification"} isOpen={isOpen} onClose={onclose}>
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
