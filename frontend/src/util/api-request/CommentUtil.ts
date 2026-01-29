import type { Comment } from "@/types/blog/Comment";
import type { PaginatedResponse } from "@/types/Page";
import axios from "axios";

export const postComment = async (comment: string, blogId: number): Promise<string> => {
    const response = await axios.post(`/api/comment/add?blogId=${blogId}`,
        comment, {
        withCredentials: true,
        headers: {
            "Content-Type":"text/plain"
        },
    });
    return response.data;
}

export const getCommentsByBlogId = async (blogId: number, pageNumber: number, pageSize: number)
    : Promise<PaginatedResponse<Comment>> => {
    const res = await axios.get(`/api/comment/get?blogId=${blogId}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        withCredentials: true
    });
    return res.data;
}

export const deleteComment = async (commentId: number): Promise<void> => {
    const res = await axios.delete(`/api/comment/delete?commentId=${commentId}`, {
        withCredentials: true
    });
    return res.data;
}
    
export const updateComment = async (commentId: number, newComment: string): Promise<string> => {
    const res = await axios.put(`/api/comment/update?commentId=${commentId}`, newComment, {
        withCredentials: true,
        headers: {
            "Content-Type":"text/plain"
        },
    });
    return res.data;
}