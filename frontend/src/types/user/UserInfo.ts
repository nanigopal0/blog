import type { AuthProvider } from "../AuthProvider.js";
import type { BasicUserInfo } from "./BasicUserInfo.js";

export interface UserInfo extends BasicUserInfo {
    email: string;
    defaultAuthProvider: AuthProvider;
    totalFollowers: number;
    totalFollowings: number;
    totalBlogs: number;
}