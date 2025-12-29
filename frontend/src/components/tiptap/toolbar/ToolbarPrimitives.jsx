import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "./ToolbarIcons";

export const ToolbarButton = ({
  onClick,
  isActive,
  disabled,
  title,
  children,
  className = "",
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`
      inline-flex items-center justify-center rounded-md p-2
      transition-all duration-150
      ${isActive
        ? "bg-purple-600 text-white dark:bg-purple-500"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
      }
      ${disabled ? "opacity-40 cursor-not-allowed" : ""}
      ${className}
    `}
  >
    {children}
  </button>
);

// Dropdown component for grouped items
// export interface ToolbarDropdownProps {
//   label: string;
//   icon: React.ReactNode;
//   isActive?: boolean;
//   children: React.ReactNode;
// }

export const ToolbarDropdown = ({
  label,
  icon,
  isActive,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm
          transition-all duration-150
          ${isActive
            ? "bg-purple-600 text-white dark:bg-purple-500"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          }
        `}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
        <ChevronDownIcon />
      </button>
      {open && (
        <div
          className="
            absolute left-0 top-full z-50 mt-1 min-w-40
            rounded-lg border border-slate-200 bg-white p-1 shadow-lg
            dark:border-slate-600 dark:bg-slate-800
          "
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
  onClick,
  isActive,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm
      transition-colors duration-150
      ${isActive
        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
      }
    `}
  >
    {children}
  </button>
);

// Visual divider between toolbar groups
export const ToolbarDivider = () => (
  <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-600" />
);

// Section header for mobile menu
export const ToolbarSectionHeader = ({ children }) => (
  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
    {children}
  </p>
);

// Section wrapper for mobile menu
export const ToolbarSection = ({ 
  title, 
  children 
}) => (
  <div className="mb-4">
    <ToolbarSectionHeader>{title}</ToolbarSectionHeader>
    <div className="flex flex-wrap gap-1">
      {children}
    </div>
  </div>
);
