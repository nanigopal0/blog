import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.theme === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    toggleHtmlTheme();
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    localStorage.setItem("theme", darkMode ? "light" : "dark");
  };

  const toggleHtmlTheme = () => {
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
