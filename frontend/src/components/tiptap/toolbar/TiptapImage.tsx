import { useState, useRef, useEffect } from "react";
import "../tiptap-node-css/image-node.scss";
import { CloseIcon, ImageIcon, UploadIcon, UrlIcon } from "./index.js";
import { uploadImage } from "@/util/UploadImageCloudinary.js";
import type { InsertSectionProps } from "../types/ToolbarSectionProps.js";



export default function TiptapImage({ editor, onComplete }:InsertSectionProps) {
  const [showPopover, setShowPopover] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    setShowPopover(false);
    setImageUrl("");
    setPreviewUrl("");
    setError("");
    setIsLoading(false);
  };

  const handleFileUpload = (event:React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setIsLoading(true);
    setError("");

    // const reader = new FileReader();
    // reader.onload = () => {
    //   const base64 = reader.result ;
    //   console.log(base64)
    //   setPreviewUrl(base64);
    //   setIsLoading(false);
    // };
    // reader.onerror = () => {
    //   setError("Failed to read file");
    //   setIsLoading(false);
    // };
    // reader.readAsDataURL(file);
    uploadImage(file)
      .then((url:string) => setPreviewUrl(url))
      .catch((error:any) => setError("Failed to upload image "+ error))
      .finally(() => {
        setIsLoading(false);
      });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlChange = (url:string) => {
    setImageUrl(url);
    setError("");
    if (url.trim()) {
      setIsLoading(true);
      const img = new Image();
      img.onload = () => {
        setPreviewUrl(url);
        setIsLoading(false);
      };
      img.onerror = () => {
        setPreviewUrl("");
        setError("Unable to load image from URL");
        setIsLoading(false);
      };
      img.src = url;
    } else {
      setPreviewUrl("");
    }
  };

  const handleInsertImage = () => {
    const src = activeTab === "url" ? imageUrl.trim() : previewUrl;
    if (src) {
      editor.chain().focus().setImage({ src }).run();
      handleClose();
      onComplete?.();
    }
  };

  const handleKeyDown = (e:React.KeyboardEvent) => {
    if (e.key === "Enter" && previewUrl) {
      handleInsertImage();
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setShowPopover(!showPopover)}
        className={`
          inline-flex items-center justify-center rounded-md p-2
          transition-all duration-150
          ${
            showPopover
              ? "bg-purple-600 text-white dark:bg-purple-500"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          }
        `}
        title="Insert Image"
      >
        <ImageIcon />
      </button>

      {/* Modal Overlay - Centered */}
      {showPopover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div
            ref={popoverRef}
            className="
              w-full max-w-md mx-4
              rounded-xl border border-slate-200 bg-white
              shadow-2xl
              dark:border-slate-600 dark:bg-slate-800
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-indigo-600 text-white">
                  <ImageIcon />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Insert Image
                </span>
              </div>
              <button
                onClick={handleClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-700">
              <button
                onClick={() => {
                  setActiveTab("upload");
                  setError("");
                  setPreviewUrl("");
                }}
                className={`
                  flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium
                  transition-colors duration-150
                  ${
                    activeTab === "upload"
                      ? "border-b-2 border-purple-600 text-purple-600 bg-purple-50/50 dark:bg-purple-900/20 dark:text-purple-400"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700/50"
                  }
                `}
              >
                <UploadIcon />
                Upload
              </button>
              <button
                onClick={() => {
                  setActiveTab("url");
                  setError("");
                  setPreviewUrl("");
                }}
                className={`
                  flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium
                  transition-colors duration-150
                  ${
                    activeTab === "url"
                      ? "border-b-2 border-purple-600 text-purple-600 bg-purple-50/50 dark:bg-purple-900/20 dark:text-purple-400"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700/50"
                  }
                `}
              >
                <UrlIcon />
                URL
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {activeTab === "upload" ? (
                <div className="space-y-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="
                      flex w-full flex-col items-center justify-center gap-3
                      rounded-xl border-2 border-dashed border-slate-200
                      bg-slate-50 px-4 py-8
                      text-slate-500 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600
                      dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-400
                      dark:hover:border-purple-500 dark:hover:bg-purple-900/20 dark:hover:text-purple-400
                      transition-all duration-150 cursor-pointer
                    "
                  >
                    <div className="rounded-full bg-slate-100 dark:bg-slate-600 p-3">
                      <UploadIcon />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium block">
                        Click to upload
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
                        PNG, JPG, GIF up to 5MB
                      </span>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="https://example.com/image.jpg"
                    className="
                      w-full rounded-lg border border-slate-200 bg-slate-50
                      px-4 py-3 text-sm text-slate-700
                      placeholder:text-slate-400
                      focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20
                      dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200
                      dark:placeholder:text-slate-500 dark:focus:bg-slate-700
                      transition-all duration-150
                    "
                    autoFocus
                  />
                </div>
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="mt-4 flex items-center justify-center py-6">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-purple-600 border-t-transparent" />
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mt-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Preview */}
              {previewUrl && !isLoading && (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-40 w-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-4 py-3 bg-slate-50/50 rounded-b-xl dark:border-slate-700 dark:bg-slate-800/50">
              <button
                onClick={handleClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertImage}
                disabled={!previewUrl || isLoading}
                className="
                  rounded-lg bg-purple-600 px-5 py-2 text-sm font-medium text-white
                  hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50
                  transition-colors duration-150
                "
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
