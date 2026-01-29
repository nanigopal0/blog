import type { UserOverview } from "../user/UserOverview";
import type { BlogReaction } from "./BlogReaction";
import type CategoryInfo from "./CategoryInfo";

export interface BlogSummary {
    blog: BlogOverview;
    author: UserOverview;
    category: CategoryInfo;
}

export interface BlogOverview {
    id: number;
    title: string;
    content: string;
    coverImage: string;
    createdAt: string;
}

export type BlogPost = {
    title: string;
    content: string;
    coverImage: string;
    categoryId: number;
    userId: number;
}

export interface BlogInfo extends BlogSummary {
    reaction: BlogReaction;
}

export type UpdateBlog = {
    title?: string;
    content?: string;
    coverImage?: string;
}


export type BlogSortField = "createdAt" | "title";

export const sortByItems: BlogSortField[] = ["createdAt", "title"];