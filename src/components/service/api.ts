import axios from "axios";

import { getStoredToken } from "../auth/AuthProvider";

// Shared Axios HTTP client used across all API service files.
const api = axios.create({
  
  // Backend API base URL configuration.
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/v1",

  // baseURL:
  //   process.env.REACT_APP_API_BASE_URL ||
  //   "https://biteflow-app-atg0hubwetg9akg3.southeastasia-01.azurewebsites.net/api/v1/",
});

// Attach authentication token to every outgoing request.
api.interceptors.request.use((config) => {
  
  // Retrieve stored authentication token.
  const token = getStoredToken();

  // Add bearer token to request headers when available.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Return updated request configuration.
  return config;
});

// Convert API and network errors into readable messages.
export const extractErrorMessage = (
  error: unknown
): string => {
  
  // Handle Axios-specific request errors.
  if (axios.isAxiosError(error)) {
    
    // Return the most meaningful available error message.
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed"
    );
  }

  // Handle standard JavaScript errors.
  if (error instanceof Error) {
    
    // Return JavaScript error message.
    return error.message;
  }

  // Return fallback message for unknown errors.
  return "Unexpected error";
};

// Export shared Axios client for use across the application.
export default api;