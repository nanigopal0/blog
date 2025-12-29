import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Dialog({ isOpen, onClose, title, children }) {
 
  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Use portal to render dialog at document body level
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-h-[90vh] max-w-md lg:max-w-xl bg-white 
       dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden flex flex-col m-auto">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl text-center flex-1 font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto dark:text-white">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
