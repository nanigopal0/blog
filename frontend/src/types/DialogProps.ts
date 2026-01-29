export type DialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
};