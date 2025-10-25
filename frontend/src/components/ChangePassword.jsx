import { AuthContext } from "@/contexts/AuthContext";
import apiErrorHandle from "@/util/APIErrorHandle";
import { updatePassword } from "@/util/UserUtil";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import Dialog from "./Dialog";

export default function ChangePassword({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterNewPassword, setReEnterNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { removeCreds } = useContext(AuthContext);

  const handleChangePassword = async () => {
    if (newPassword !== reEnterNewPassword)
      toast.error("Passwords do not match");
    else {
      setLoading(true);
      const loadingId = toast.loading("Changing password...");
      try {
        const data = {
          oldPassword: currentPassword,
          newPassword: newPassword,
        };
        const result = await updatePassword(data);
        toast.success(result);
      } catch (error) {
        const retry = await apiErrorHandle(error, removeCreds);
        if(retry) handleChangePassword();
      } finally {
        toast.dismiss(loadingId);
        setLoading(false);
      }
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={"Change Password"}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-500 rounded-lg bg-white dark:bg-gray-700 "
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-500 rounded-lg bg-white dark:bg-gray-700 "
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Re-enter New Password
          </label>
          <input
            type="password"
            value={reEnterNewPassword}
            onChange={(e) => setReEnterNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-500 rounded-lg bg-white dark:bg-gray-700 "
          />
        </div>

        <button
          onClick={handleChangePassword}
          disabled={loading}
          className=" bg-blue-600 mx-auto hover:bg-blue-700 disabled:text-gray-400 disabled:bg-blue-900 disabled:cursor-not-allowed
         text-white font-medium py-2 px-4 rounded-full cursor-pointer "
        >
          {loading ? "Changing Password..." : "Change Password"}
        </button>
      </div>
    </Dialog>
  );
}
