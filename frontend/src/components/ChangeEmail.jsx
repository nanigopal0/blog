import { AuthContext } from "@/contexts/AuthContext";
import apiErrorHandle from "@/util/APIErrorHandle";
import { updateUser } from "@/util/UserUtil";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

export default function ChangeEmail({ email }) {
  const [updatedEmail, setUpdatedEmail] = useState(email);
  const [loading, setLoading] = useState(false);
  const [isVerifyEmailSent, setIsVerifyEmailSent] = useState(false);
  const { updateUserInfo, removeCreds } = useContext(AuthContext);
  const [otp, setOTP] = useState("");

  const handleVerifyClick = async () => {
    setLoading(true);
    try {
      const result = await updateUser({ email: updatedEmail });
      updateUserInfo(result);
      toast.success("Email updated successfully. Please login again.");
    } catch (error) {
      apiErrorHandle(error, removeCreds);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={updatedEmail}
          disabled={isVerifyEmailSent}
          onChange={(e) => setUpdatedEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-500 rounded-lg
           bg-white dark:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-600 disabled:dark:text-gray-400"
        />
      </div>

      {isVerifyEmailSent && (
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
        onClick={isVerifyEmailSent ? handleVerifyClick : sendOTP}
        disabled={loading}
        className=" bg-blue-600 mx-auto hover:bg-blue-700 disabled:text-gray-400 disabled:bg-blue-900 disabled:cursor-not-allowed
         text-white font-medium py-2 px-4 rounded-full cursor-pointer "
      >
        {isVerifyEmailSent
          ? loading
            ? "Verifying..."
            : "Verify"
          : loading
          ? "Sending OTP..."
          : "Send OTP"}
      </button>
    </div>
  );
}
