import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import apiErrorHandle from "@/util/APIErrorHandle";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({});

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
      const response = await axios.get(`/api/user/ping`, {
        withCredentials: true,
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

  const removeCreds = () => {
    Cookies.remove("user");
    setIsAuthenticated(false);
    setUserInfo(null);
  };

  // Function to log out (clear token)
  const logout = async () => {
    try {
      const response = await axios.get(`/api/user/logout`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        removeCreds();
      }
    } catch (error) {
      apiErrorHandle(error, removeCreds);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        removeCreds,
        userInfo,
        updateUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
