import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import Cookies from "js-cookie";
import apiErrorHandle from "@/util/APIErrorHandle";
import type { APIError } from "@/util/APIErrorHandle";
import { 
  getBasicUserInfo,
  logoutUser,
  pingUser,
} from "@/util/api-request/UserUtil";
import type { BasicUserInfo } from "@/types/user/BasicUserInfo";

export interface AuthContextType {
  isAuthenticated: boolean;
  login: () => Promise<boolean | void>;
  logout: () => Promise<void>;
  removeCreds: () => void;
  basicUserInfo: BasicUserInfo | null;
  saveUserInfoToState: (user: BasicUserInfo) => void;
  initializeAuth: () => Promise<void>;
  updateUserInfo: (user: BasicUserInfo) => void;
}


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType =>{
  const context = useContext(AuthContext);
  if(!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [basicUserInfo, setBasicUserInfo] = useState<BasicUserInfo | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    await getBasicUserInfoFromBackend();
  };

  const getBasicUserInfoFromBackend = async (): Promise<void> => {
    try{
      const user =  await getBasicUserInfo();
      saveUserInfoToState(user);
    }catch(error){
       removeCreds();
    }
  }

  const saveUserInfoToState = (user: BasicUserInfo): void => {
    Cookies.set("user", btoa(JSON.stringify(user)), {
      expires: 7,
      secure: true,
      sameSite: "Strict",
      httpOnly: false,
    });
    setBasicUserInfo(user);
    setIsAuthenticated(true);
  }


  // Function to update user info in cookies and state to authenticated
  const updateUserInfo = (user: BasicUserInfo): void => {
    Cookies.set("user", btoa(JSON.stringify(user)), {
      expires: 7,
      secure: true,
      sameSite: "Strict",
      httpOnly: false,
    });
    setBasicUserInfo(user);
    setIsAuthenticated(true);
  };

  const login = async (): Promise<boolean> => {
    try {
      const isValidToken = await pingUser();
      if (isValidToken) setIsAuthenticated(true);
      else removeCreds();
      return isValidToken;
    } catch (error) {
      console.error("Failed to ping", (error as Error).message || error);
      return false;
    }
  };

  const removeCreds = (): void => {
    Cookies.remove("user");
    setIsAuthenticated(false);
    setBasicUserInfo(null);
  };

  // Function to log out (clear token)
  const logout = async (): Promise<void> => {
    try {
      const success = await logoutUser();
      if (success) removeCreds();
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        removeCreds,
        basicUserInfo,
        saveUserInfoToState,
        initializeAuth,
        updateUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
