import type { Role } from "./Role.js";

export interface BasicUserInfo {
    id: number;
    userVerified: boolean;
    username: string;
    name: string;
    photo: string | null;
    role: Role;
    bio: string | null;
};