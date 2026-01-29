import toast from "react-hot-toast";
import { AxiosError } from "axios";
import type { AuthContextType } from "@/contexts/AuthContext";

/**
 * Standard API error response structure
 */
export interface APIErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
  timestamp?: string;
  path?: string;
  details?: Record<string, any>;
}

/**
 * Type alias for API errors with typed response data
 */
export type APIError = AxiosError<APIErrorResponse>;

/**
 * Default error messages for common HTTP status codes
 */
export const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  400: "Bad request. Please check your input.",
  401: "Session expired. Please login again.",
  403: "You don't have access to this resource.",
  404: "The requested resource was not found.",
  409: "A conflict occurred. The resource may already exist.",
  422: "Invalid data provided. Please check your input.",
  429: "Too many requests. Please try again later.",
  500: "Internal server error. Please try again later.",
  502: "Bad gateway. The server is temporarily unavailable.",
  503: "Service unavailable. Please try again later.",

};

/**
 * Extracts a user-friendly error message from an API error
 */
export function getErrorMessage(error: APIError): string {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    (error.response?.status
      ? DEFAULT_ERROR_MESSAGES[error.response.status]
      : undefined) ||
    error.response?.statusText ||
    error.message ||
    "An unexpected error occurred"
  );
}
/**
 * Handles API errors with consistent error messaging and logging
 * @param error - The Axios error object
 * @param removeCreds - Callback function to remove user credentials
 */
export default function apiErrorHandle(
  error: APIError,
  removeCreds: AuthContextType["removeCreds"]
): void {
  const status = error.response?.status;
  try {
    const errorMessage = getErrorMessage(error);
    if (status === 401)
      removeCreds();
    console.error("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: errorMessage,
    });

    toast.error(errorMessage);
  } catch (error) {
    console.error("Error handling API error:", error);
    toast.error("An unexpected error occurred");
  }

}
