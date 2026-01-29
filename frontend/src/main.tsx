import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.js";
import { ThemeContextProvider } from "./contexts/ThemeContext.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    </AuthProvider>
  </React.StrictMode>,
);
