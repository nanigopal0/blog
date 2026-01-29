import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";

export interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}


interface ThemeContextProviderProps {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeContextProvider");
  return context;
}

export const ThemeContextProvider = ({ children }: ThemeContextProviderProps) => {
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage["theme"] === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    toggleHtmlTheme();
  }, [darkMode]);

  const toggleTheme = (): void => {
    setDarkMode((prev) => !prev);
    localStorage.setItem("theme", darkMode ? "light" : "dark");
  };

  const toggleHtmlTheme = (): void => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }
    document.documentElement.classList.toggle("dark", darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
