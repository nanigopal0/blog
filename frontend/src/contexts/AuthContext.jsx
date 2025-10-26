import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import apiErrorHandle from "@/util/APIErrorHandle";
import {
  generateAccessTokenFromRefreshToken,
  getCurrentUser,
} from "@/util/UserUtil";

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
      const ref = Cookies.get("ref-token");
      if (ref) {
        try {
          await generateAccessTokenFromRefreshToken();
          return ping();
        } catch (err) {
          console.log(err);
        }
      }
      return false;
    }
  };

  // Function to update user info in cookies and state to authenticated
  const updateUserInfo = (user) => {
    Cookies.set("user", btoa(JSON.stringify(user)), {
      expires: 7,
      secure: true,
      sameSite: "Strict",
      httpOnly: false,
    });
    setUserInfo(user);
    setIsAuthenticated(true);
  };

  const setRefreshToken = (token) => {
    Cookies.set("ref-token", token, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
  };

  const login = async () => {
    const isValidToken = await ping();
    if (isValidToken) {
      const fetchedUser = await getCurrentUser();
      updateUserInfo(fetchedUser);
    } else {
      removeCreds();
    }
  };

  const removeCreds = () => {
    Cookies.remove("user");
    Cookies.remove("ref-token");
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
        setRefreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
