import axios from "axios";

export const getAllBlogs = async (
  pageNumber,
  pageSize,
  sortBy = "time",
  sortOrder = "desc"
) => {
  const response = await axios.get(
    `/api/blog/get-all-blogs?pageNumber=${pageNumber}&pageSize=${pageSize}
    &sortBy=${sortBy}&sortDir=${sortOrder}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const getBlogsByUser = async (
  userId,
  pageNumber,
  pageSize,
  sortBy = "time",
  sortOrder = "desc"
) => {
  const response = await axios.get(
    `/api/blog/get-all-of-user?userId=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize}
    &sortBy=${sortBy}&sortDir=${sortOrder}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const postBlog = async (blogData) => {
  const response = await axios.post("/api/blog/add", blogData, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getBlogById = async (blogId) => {
  const response = await axios.get(`/api/blog/get/${blogId}`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteBlogById = async (blogId) => {
  const response = await axios.delete(`/api/blog/delete/${blogId}`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateBlogById = async (blogData) => {
  const response = await axios.put(`/api/blog/update`, blogData, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const searchBlogs = async (
  query,
  pageNumber,
  pageSize = 1,
  sortBy = "time",
  sortOrder = "desc"
) => {
  const response = await axios.get(
    `/api/blog/search?keyword=${query}&pageNumber=${pageNumber}
    &pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortOrder}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getBlogsByCategory = async (
  categoryId,
  pageNumber,
  pageSize,
  sortBy = "time",
  sortOrder = "desc"
) => {
  const response = await axios.get(
    `/api/blog/get/category?id=${categoryId}&pageNumber=${pageNumber}
    &pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortOrder}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
