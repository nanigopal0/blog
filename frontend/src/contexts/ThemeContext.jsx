import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(localStorage.theme === "dark");

  useEffect(() => {
    toggleHtmlTheme();
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    localStorage.setItem("theme", darkMode ? "light" : "dark");
  };

  const toggleHtmlTheme = () => {
    if (!localStorage.getItem("theme")) {
      document.documentElement.classList.toggle(
        "dark",
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    } else {
      document.documentElement.classList.toggle("dark", darkMode);
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
