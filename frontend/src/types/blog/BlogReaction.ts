export interface BlogReaction {
    reactionId: number;
    totalLikes: number;
}

export type BlogReactionRequest = {
    userId: number;
    blogId: number;
} 