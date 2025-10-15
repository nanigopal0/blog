import axios from "axios";
import Cookies from "js-cookie";

export const getUserByUsername = async (username) => {
  const response = await axios.get(
    `/api/user/get-by-username?username=${username}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await axios.get(`/api/user/get-by-id?id=${userId}`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get("/api/user/get-current-user", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteUser = async (otp) => {
  const response = await axios.delete(`/api/user/verify-delete-user?otp=${otp}`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 204) {
    Cookies.remove("jwt");
  }
  return response.data;
};

export const searchUsers = async (name, pageNumber, pageSize=10) => {
  const response = await axios.get(
    `/api/user/search?name=${name}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const updateUser = async (userData) => {
  const response = await axios.put("/api/user/update/profile", userData, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updatePassword = async (passwordData) => {
  const response = await axios.put("/api/user/change/password", passwordData, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getFollowers = async (userId) => {
  const response = await axios.get(
    `/api/follower/get-followers?userId=${userId}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getFollowings = async (userId) => {
  const response = await axios.get(
    `/api/follower/get-followings?userId=${userId}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const isFollowing = async (userId, followedId) => {
  const response = await axios.get(
    `/api/follower/is-follows?userId=${userId}&followedId=${followedId}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
