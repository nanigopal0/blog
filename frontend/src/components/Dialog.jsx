import { X } from "lucide-react";

export default function Dialog({ isOpen, onClose, title, children }) {
 
  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-h-[90vh] my-4 max-w-md lg:max-w-xl mx-4 bg-gray-200
       dark:bg-gray-800 border border-black/30 dark:border-white/20 shadow-2xl rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-2xl text-center flex-1 font-medium text-gray-800 dark:text-gray-200">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1  rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 ml-auto text-gray-500 dark:text-gray-400 cursor-pointer" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
