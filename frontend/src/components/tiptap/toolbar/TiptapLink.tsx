import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  CheckIcon,
  CloseIcon,
  CopyIcon,
  EditIcon,
  ExternalLinkIcon,
  LinkIcon,
  UnlinkIcon,
} from "./index.js";
import "../tiptap-node-css/link-node.scss";
import type { InsertSectionProps } from "../types/ToolbarSectionProps.js";
import { type LinkProtocolOptions } from "@tiptap/extension-link";

export default function TiptapLink({ editor, onComplete }:InsertSectionProps) {
  const [showPopover, setShowPopover] = useState(false);
  const [url, setUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isLink = editor.isActive("link");
  const linkHref = editor.getAttributes("link")["href"] || "";

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event:MouseEvent) => {
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

  // Focus input when editing
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Sync URL state when popover opens
  useEffect(() => {
    if (showPopover) {
      setUrl(linkHref);
    }
  }, [showPopover, linkHref]);

  const handleClose = () => {
    setShowPopover(false);
    setIsEditing(false);
    setUrl("");
  };

  const handleSetLink = useCallback(() => {
    if (url.trim()) {
      let finalUrl = url.trim();
      if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith("mailto:")) {
        finalUrl = "https://" + finalUrl;
      }
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: finalUrl })
        .run();
      handleClose();
      onComplete?.();
    }
  }, [editor, url, onComplete]);

  const handleUnsetLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
    handleClose();
    onComplete?.();
  }, [editor, onComplete]);

  const handleKeyDown = (e:React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSetLink();
    } else if (e.key === "Escape") {
      if (isLink) {
        setIsEditing(false);
        setUrl(linkHref);
      } else {
        handleClose();
      }
    }
  };

  const handleOpenLink = () => {
    if (linkHref) {
      window.open(linkHref, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyLink = async () => {
    if (linkHref) {
      try {
        await navigator.clipboard.writeText(linkHref);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        const textArea = document.createElement("textarea");
        textArea.value = linkHref;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleTogglePopover = () => {
    if (!showPopover) {
      setShowPopover(true);
      if (!isLink) {
        setIsEditing(true);
        setUrl("");
      }
    } else {
      handleClose();
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleTogglePopover}
        className={`
          inline-flex items-center justify-center rounded-md p-2
          transition-all duration-150
          ${
            isLink || showPopover
              ? "bg-purple-600 text-white dark:bg-purple-500"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          }
        `}
        title={isLink ? "Edit link" : "Add link"}
      >
        <LinkIcon />
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
                  <LinkIcon />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {isLink ? "Edit Link" : "Add Link"}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="p-4">
              {isEditing || !isLink ? (
                /* Editing Mode */
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
                      URL
                    </label>
                    <input
                      ref={inputRef}
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="https://example.com"
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

                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Press Enter to save, Escape to cancel
                  </p>
                </div>
              ) : (
                /* View Mode */
                <div className="space-y-4">
                  {/* Link Preview */}
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-700 dark:border-slate-600">
                    <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                      {linkHref.replace(/^https?:\/\//, "")}
                    </p>
                    <p className="truncate text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {linkHref}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="
                        flex flex-col items-center justify-center gap-1.5 rounded-xl
                        p-3 text-slate-600 hover:bg-slate-100 border border-slate-100
                        dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-600
                        transition-colors duration-150
                      "
                    >
                      <EditIcon />
                      <span className="text-xs font-medium">Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="
                        flex flex-col items-center justify-center gap-1.5 rounded-xl
                        p-3 text-slate-600 hover:bg-slate-100 border border-slate-100
                        dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-600
                        transition-colors duration-150
                      "
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                      <span className="text-xs font-medium">
                        {copied ? "Copied!" : "Copy"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenLink}
                      className="
                        flex flex-col items-center justify-center gap-1.5 rounded-xl
                        p-3 text-slate-600 hover:bg-slate-100 border border-slate-100
                        dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-600
                        transition-colors duration-150
                      "
                    >
                      <ExternalLinkIcon />
                      <span className="text-xs font-medium">Open</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleUnsetLink}
                      className="
                        flex flex-col items-center justify-center gap-1.5 rounded-xl
                        p-3 text-red-600 hover:bg-red-50 border border-red-100
                        dark:text-red-400 dark:hover:bg-red-900/20 dark:border-red-800
                        transition-colors duration-150
                      "
                    >
                      <UnlinkIcon />
                      <span className="text-xs font-medium">Remove</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Only show in editing mode */}
            {(isEditing || !isLink) && (
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-4 py-3 bg-slate-50/50 rounded-b-xl dark:border-slate-700 dark:bg-slate-800/50">
                <button
                  type="button"
                  onClick={() => {
                    if (isLink) {
                      setIsEditing(false);
                      setUrl(linkHref);
                    } else {
                      handleClose();
                    }
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSetLink}
                  disabled={!url.trim()}
                  className="
                    rounded-lg bg-purple-600 px-5 py-2 text-sm font-medium text-white
                    hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50
                    transition-colors duration-150
                  "
                >
                  {isLink ? "Update Link" : "Add Link"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export const shouldAutoLink = (url:string):boolean => {
  try {
    const parsedUrl = url.includes(":")
      ? new URL(url)
      : new URL(`https://${url}`);

    const disallowedDomains = [
      "example-no-autolink.com",
      "another-no-autolink.com",
    ];
    const domain = parsedUrl.hostname;

    return !disallowedDomains.includes(domain);
  } catch {
    return false;
  }
};

export const validateUrl = (url:string,
   ctx:{
    defaultValidate: (url: string) => boolean;
    protocols: (string | LinkProtocolOptions)[];
    defaultProtocol: string;
   }) => {
  try {
    const parsedUrl = url.includes(":")
      ? new URL(url)
      : new URL(`${ctx.defaultProtocol}://${url}`);

    if (!ctx.defaultValidate(parsedUrl.href)) {
      return false;
    }

    const disallowedProtocols = ["ftp", "file", "mailto"];
    const protocol = parsedUrl.protocol.replace(":", "");

    if (disallowedProtocols.includes(protocol)) {
      return false;
    }

    const allowedProtocols = ctx.protocols.map((p) =>
      typeof p === "string" ? p : p.scheme
    );

    if (!allowedProtocols.includes(protocol)) {
      return false;
    }

    const disallowedDomains = ["example-phishing.com", "malicious-site.net"];
    const domain = parsedUrl.hostname;

    if (disallowedDomains.includes(domain)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};
