import axios from "axios";
import Cookies from "js-cookie";
import type { BasicUserInfo } from "@/types/user/BasicUserInfo";
import type { UserInfo } from "@/types/user/UserInfo";
import type { PaginatedResponse } from "@/types/Page";
import type { UserOverview } from "@/types/user/UserOverview";
import type { UpdateProfile } from "@/types/user/UpdateProfile";
import type { ChangePassword } from "@/types/user/ChangePassword";
import type { AuthProviderResponse } from "@/types/AuthProvider";

//------------------------------
export const getUserByUsername = async (username: string): Promise<BasicUserInfo> => {
  const response = await axios.get(
    `/api/user/get-by-username?username=${username}`,
    {
      withCredentials: true
    }
  );
  return response.data;
};

export const getBasicUserInfo = async (): Promise<BasicUserInfo> => {
  const response = await axios.get("/api/user/get-basic-info", {
    withCredentials: true
  });
  return response.data;
};

export const logoutUser = async (): Promise<boolean> => {
  const response = await axios.get(`/api/user/logout`, {
    withCredentials: true
  });
  return response.status == 200;
};


export const pingUser = async (): Promise<boolean> => {
  const response = await axios.get(`/api/user/ping`, {
    withCredentials: true
  });
  return response.status === 200 ? true : false;
};

export const getUserById = async (userId: number): Promise<BasicUserInfo> => {
  const response = await axios.get(`/api/user/get-by-id?id=${userId}`, {
    withCredentials: true
  });
  return response.data;
};

export const getCurrentUser = async (): Promise<UserInfo> => {
  const response = await axios.get("/api/user/get-current-user", {
    withCredentials: true
  });
  return response.data;
};
//------------------------------
export const deleteUser = async (otp: string) => {
  const response = await axios.delete(
    `/api/user/verify-delete-user?otp=${otp}`,
    {
      withCredentials: true
    }
  );
  if (response.status === 204) {
    Cookies.remove("jwt");
  }
};

export const searchUsers = async (name: string, pageNumber: number, pageSize = 10): Promise<PaginatedResponse<UserOverview>> => {
  const response = await axios.get(
    `/api/user/search?name=${name}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    {
      withCredentials: true
    }
  );
  return response.data;
};
//------------------------------
export const updateUser = async (userData: UpdateProfile): Promise<BasicUserInfo> => {
  const response = await axios.put("/api/user/update-profile", userData, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
//------------------------------
export const updatePassword = async (passwordData: ChangePassword): Promise<string> => {
  const response = await axios.put("/api/user/change-password", passwordData, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const setPasswordServer = async (password: string): Promise<string> => {
  const response = await axios.put("/api/user/set-password",  password , {
    withCredentials: true,
    headers: {
      "Content-Type": "text/plain",
    },
  });
  return response.data;
}

export const unlinkOAuthProvider = async (authModeId: number): Promise<string> => {
  const response = await axios.delete(`/api/user/unlink-auth-provider?authModeId=${authModeId}`, {
    withCredentials: true
  });
  return response.data;
}

export const getAllLinkedAuthProviders = async (): Promise<AuthProviderResponse[]> => {
  const response = await axios.get(`/api/user/get-auth-providers`, {
    withCredentials: true
  });
  return response.data;
}

export const changeDefaultAuthProvider = async (authModeId: number): Promise<string> => {
  const response = await axios.put(`/api/user/change-default-auth-provider?authModeId=${authModeId}`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export const verifyEmailOTP = async (otp: string, email: string): Promise<string> => {
  const response = await axios.put(
    `/api/public/verify-email?otp=${otp}&email=${email}`,
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
}

export const verifyChangeEmailRequest = async (otp: string): Promise<string> => {
  const result = await axios.put(
    `/api/user/verify-update-email?otp=${otp}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    },
  );
  return result.data;
}

export const sendChangeEmailOTP = async (currentEmail: string, updatedEmail: string, password: string): Promise<string> => {
  const result = await axios.put(
    "/api/user/change-email-otp",
    {
      email: currentEmail,
      password: password,
      newEmail: updatedEmail,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    },
  );
  return result.data;
}

export const sendDeleteAccountOTP = async (): Promise<string> => {
  const response = await axios.get(`/api/user/delete-user-otp`, {
    headers: {
      "Content-type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
}

export const sendForgotPasswordOTP = async (email: string): Promise<string> => {
  const response = await axios.post(
    `/api/public/send-forgot-password-otp?email=${email}`,
    {
      headers: { "Content-Type": "text/plain" },
    }
  );
  return response.data;
}

export const resetPasswordWithOTP = async (email: string, otp: string, newPassword: string): Promise<string> => {
  const response = await axios.post(
    `/api/public/reset-password`,
    {
      email: email,
      OTP: otp,
      newPassword: newPassword,
    },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
}

export const registerUser = async (name: string, email: string, password: string): Promise<string> => {
  const res = await axios.post(`/api/public/signup`, {
    name, email, password
  }, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}
