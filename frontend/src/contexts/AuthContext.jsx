import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Load the token from cookies when the app starts
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const user = Cookies.get("user");
    if (user) {
      setUserInfo(JSON.parse(atob(user)));
    }
    await login();
  };

  // Function to check if the user is authenticated in the backend
  const ping = async () => {
    try {
      const response = await fetch(`/api/user/ping`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.status === 200 ? true : false;
    } catch (error) {
      console.error("Failed to ping", error.message || error);
      return false;
    }
  };

  // Function to update user info in cookies and state to authenticated
  const updateUserInfo = (user) => {
    Cookies.set("user", btoa(JSON.stringify(user)));
    setUserInfo(user);
    setIsAuthenticated(true);
  };

  // Function to log in (set token)
  const login = async () => {
    const isValidToken = await ping();
    if (isValidToken) {
      setIsAuthenticated(true);
      const user = Cookies.get("user");
      if (user) {
        setUserInfo(JSON.parse(atob(user)));
      }
    } else {
      logout();
    }
  };

  // Function to log out (clear token)
  const logout = async () => {
    await fetch(`/api/user/logout`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          Cookies.remove("user");
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        console.error("Failed to logout", error.message || error);
      });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, userInfo, updateUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};
