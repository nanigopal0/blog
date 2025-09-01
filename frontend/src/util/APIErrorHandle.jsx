import toast from "react-hot-toast";

export default function apiErrorHandle(error, removeCreds) {
  switch (error.response && error.response?.status) {
        case 401:
          console.log("Unauthenticated! Redirecting to login...");
          toast.error("Session expired. Please login again.");
          removeCreds();
          break;
        case 403:
          console.log("Don't have access to the resource");
          toast.error("You don't have access to this resource.");
          removeCreds();
          break;

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
      }
}