import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../util/BaseUrl";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userInfo,setUserInfo] = useState(null);

  // Load the token from cookies when the app starts
  useEffect(() => {
    const user = Cookies.get("user");
    if (user) 
      setUserInfo(JSON.parse(user));
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = Cookies.get("token");
    // if (token) {
      await login(); // Wait for the login process to complete
    // } else {
      // logout();
    // }
  };

  // Function to check if the user is authenticated in the backend
  const ping = async () => {
    try {
      // if (!token) throw new Error("Token not found");
      const response = await fetch(`${API_BASE_URL}/user/ping`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        //   Authorization: token,
        },
      });
      return response.status === 200 ? true : false;
    } catch (error) {
      console.error("Failed to ping", error.message || error);
      return false;
    }
  };

  const updateUserInfo= (user) =>{
    Cookies.set("user", JSON.stringify(user));
    setUserInfo(user);
  }

  // Function to log in (set token)
  const login = async () => {
    const isValidToken = await ping();
    if (isValidToken) {
      // Cookies.set("token", token)
      // setAuthToken(token);
      setIsAuthenticated(true);
    } else {
      logout();
    }
  };

  // Function to log out (clear token)
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authToken, isAuthenticated, login, logout, userInfo, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
