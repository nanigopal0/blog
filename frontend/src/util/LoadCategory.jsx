import axios from "axios";

export const getCategoriesFromServer = async () => {
  const response = await axios.get(`/api/category/all`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const searchCategories = async (categoryName) => {
  const response = await axios.get(
    `/api/category/search?categoryName=${categoryName}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
