import type { DialogProps } from "@/types/DialogProps";
import Dialog from "./Dialog";
import { useState } from "react";
import toast from "react-hot-toast";
import { setPasswordServer } from "@/util/api-request/UserUtil";
import apiErrorHandle, { type APIError } from "@/util/APIErrorHandle";
import { useAuth } from "@/contexts/AuthContext";

export default function SetPassword(dialogProps: DialogProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { removeCreds } = useAuth();

    const handleSetPasswordBtnClick = async () => {
        const toastId = toast.loading("Setting password...");
        try {
            const res = await setPasswordServer(password);
            toast.success(res);
            dialogProps.onSuccess?.();
            resetState();
        } catch (error) {
            apiErrorHandle(error as APIError, removeCreds)
        } finally {
            toast.dismiss(toastId);
        }
    }

    const resetState = () => {
        setPassword("");
        setConfirmPassword("");
        dialogProps.onClose();
    }

    return (
        <Dialog isOpen={dialogProps.isOpen} onClose={resetState} title="Set Password" outsideClickCloses={false}>
            <div className="mt-4">
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full mt-3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors
                    disabled:bg-blue-300"
                    onClick={handleSetPasswordBtnClick}
                    disabled={password.length === 0 || password !== confirmPassword}
                >
                    Set Password
                </button>
            </div>
        </Dialog>
    );
}