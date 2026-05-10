import api from "./api";

import { AuthResponse } from "../model/types";

// Send login request using customer or admin credentials.
export const appLogin = async (
  payload: {
    email: string;
    password: string;
  }
): Promise<AuthResponse> => {
  
  // Send authentication request to the signin endpoint.
  const response = await api.post<AuthResponse>(
    "/auth/signin",
    payload
  );

  // Return authentication response data.
  return response.data;
};

// Send signup request to create a new user account.
export const appSignup = async (
  payload: {
    fullName: string;
    email: string;
    password: string;
  }
): Promise<AuthResponse> => {
  
  // Send account creation request to the signup endpoint.
  const response = await api.post<AuthResponse>(
    "/auth/signup",
    payload
  );

  // Return authentication response data.
  return response.data;
};