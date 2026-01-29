import type { PaginatedResponse } from "@/types/Page";
import type { Follow, FollowerInfo } from "@/types/user/Follow";
import type { UserOverview } from "@/types/user/UserOverview";
import axios from "axios";

export async function getFollowerInfo(followedId: number): Promise<FollowerInfo> {
    const res = await axios.get(`/api/follower/get?followedId=${followedId}`, {
        withCredentials: true,
    });
    return res.data;
}

export const follow = async (followedId: number): Promise<Follow> => {
  const response = await axios.post(`/api/follower/follow?followedId=${followedId}`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export const unfollow = async (followedId: number): Promise<Follow> => {
  const response = await axios.delete(`/api/follower/unfollow?followedId=${followedId}`, {
    withCredentials: true
  });
  return response.data;
}

export const getFollowers = async (userId: number): Promise<PaginatedResponse<UserOverview>> => {
  const response = await axios.get(
    `/api/follower/get-followers?userId=${userId}`,
    {
      withCredentials: true
    }
  );
  return response.data;
};

export const getFollowings = async (userId: number): Promise<PaginatedResponse<UserOverview>> => {
  const response = await axios.get(
    `/api/follower/get-followings?userId=${userId}`,
    {
      withCredentials: true
    }
  );
  return response.data;
};
