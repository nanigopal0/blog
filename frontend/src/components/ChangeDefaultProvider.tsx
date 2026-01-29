import { useState } from "react";
import Dialog from "./Dialog";
import { changeDefaultAuthProvider } from "@/util/api-request/UserUtil";
import apiErrorHandle, { type APIError } from "@/util/APIErrorHandle";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import type { AuthProviderResponse } from "@/types/AuthProvider";

interface ChangeDefaultProviderProps {
    isOpen: boolean;
    onClose: () => void;
    selectedProvider: AuthProviderResponse | null;
    onSuccess: (providerName: string) => void;
}

export default function ChangeDefaultProvider({
    isOpen,
    onClose,
    selectedProvider,
    onSuccess,
}: ChangeDefaultProviderProps) {
    const [changingProvider, setChangingProvider] = useState(false);
    const { removeCreds } = useAuth();

    const handleConfirm = async () => {
        if (!selectedProvider) return;

        try {
            setChangingProvider(true);
            const res = await changeDefaultAuthProvider(selectedProvider.authModeId);
            toast.success(res);
            onSuccess(selectedProvider.authProviderName);
            onClose();
        } catch (error) {
            apiErrorHandle(error as APIError, removeCreds);
        } finally {
            setChangingProvider(false);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Change Default Provider">
            {selectedProvider && (
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">
                        Are you sure you want to change your default authentication provider
                        to{" "}
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {selectedProvider.authProviderName}
                        </span>
                        ?
                    </p>
                    <div className="flex gap-3 pt-2">
                        <button
                            disabled={changingProvider}
                            onClick={handleConfirm}
                            className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white rounded-lg transition-colors"
                        >
                            {changingProvider ? "Changing..." : "Confirm"}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </Dialog>
    );
}
