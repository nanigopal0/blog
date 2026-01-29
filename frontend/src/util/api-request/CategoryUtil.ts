import type CategoryInfo from "@/types/blog/CategoryInfo";
import axios from "axios";

export const getCategoriesFromServer = async ():Promise<CategoryInfo[]> => {
  const response = await axios.get(`/api/category/all`, {
    withCredentials: true
  });

  return response.data;
};

export const searchCategories = async (categoryName:string):Promise<CategoryInfo[]> => {
  const response = await axios.get(
    `/api/category/search?categoryName=${categoryName}`,
    {
      withCredentials: true
    }
  );
  return response.data;
};
