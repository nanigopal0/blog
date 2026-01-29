import type { UserOverview } from "../user/UserOverview";

export type Comment = {
    commentId: number;
    comment: string;
    commenter: UserOverview,
    commentedAt: string,
}