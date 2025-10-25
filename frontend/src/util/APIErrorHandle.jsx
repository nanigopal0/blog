import toast from "react-hot-toast";
import { generateAccessTokenFromRefreshToken } from "./UserUtil";

export default async function apiErrorHandle(error, removeCreds) {
  switch (error.response && error.response?.status) {
    case 401:
      console.log(
        "Unauthenticated! Genearting access token from refresh token..."
      );
      try {
        await generateAccessTokenFromRefreshToken();
        return true;
      } catch (err) {
        console.error("Error generating access token from refresh token", err);
        toast.error("Session expired. Please login again.");
        removeCreds();
        return false;
      }

    case 403:
      console.log("Don't have access to the resource");
      toast.error("You don't have access to this resource.");
      removeCreds();
      return false;

    default:
      console.error(
        error.response?.data?.message ||
          error.message ||
          "Error fetching from server"
      );
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error fetching from server"
      );
      return false;
  }
}
