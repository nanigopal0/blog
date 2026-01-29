import type { BlogSummary, BlogPost, BlogInfo, UpdateBlog, BlogSortField } from "@/types/blog/BlogInfo";
import type { BlogReaction } from "@/types/blog/BlogReaction";
import type { PaginatedResponse } from "@/types/Page";
import axios from "axios";

export const getAllBlogs = async (
  pageNumber: number,
  pageSize: number,
  sortBy: BlogSortField = "createdAt",
  sortOrder = "desc"
): Promise<PaginatedResponse<BlogSummary>> => {
  const response = await axios.get(
    `/api/blog/get-all-blogs?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortOrder}`,
    {
      withCredentials: true,

    }
  );

  return response.data;
};

export const getBlogsByUser = async (
  userId: number,
  pageNumber: number,
  pageSize: number,
  sortBy: BlogSortField = "createdAt",
  sortOrder = "desc"
): Promise<PaginatedResponse<BlogSummary>> => {
  const response = await axios.get(
    `/api/blog/get-all-of-user?userId=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortOrder}`,
    {
      withCredentials: true,

    }
  );
  return response.data;
};

export const postBlog = async (blogData: BlogPost): Promise<string> => {
  const response = await axios.post("/api/blog/add", blogData, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getBlogById = async (blogId: number): Promise<BlogInfo> => {
  const response = await axios.get(`/api/blog/get/${blogId}`, {
    withCredentials: true,

  });
  return response.data;
};

export const deleteBlogById = async (blogId: number): Promise<void> => {
  const response = await axios.delete(`/api/blog/delete/${blogId}`, {
    withCredentials: true,

  });
  return response.data;
};

export const updateBlogById = async (updateBlogData: UpdateBlog, blogId: number): Promise<string> => {
  const response = await axios.put(`/api/blog/update?blogId=${blogId}`, updateBlogData, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const searchBlogs = async (
  query: string,
  pageNumber: number,
  pageSize = 1,
  sortBy: BlogSortField = "createdAt",
  sortOrder = "desc"
): Promise<PaginatedResponse<BlogSummary>> => {
  const response = await axios.get(
    `/api/blog/search?keyword=${query}&pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortOrder}`,
    {
      withCredentials: true,

    }
  );
  return response.data;
};

export const getBlogsByCategory = async (
  categoryId: number,
  pageNumber: number,
  pageSize: number,
  sortBy: BlogSortField = "createdAt",
  sortOrder = "desc"
): Promise<PaginatedResponse<BlogSummary>> => {
  const response = await axios.get(
    `/api/blog/get/category?id=${categoryId}&pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortOrder}`,
    {
      withCredentials: true,

    }
  );
  return response.data;
};


export const likeBlog = async (blogId: number): Promise<BlogReaction> => {
  const response = await axios.post(`/api/blog/reaction/like?blogId=${blogId}`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export const unlikeBlog = async (reactionId: number, blogId: number): Promise<BlogReaction> => {
  const response = await axios.delete(
    `/api/blog/reaction/dislike?blogReactionId=${reactionId}&blogId=${blogId}`,
    {
      withCredentials: true
    }
  );
  return response.data;
}