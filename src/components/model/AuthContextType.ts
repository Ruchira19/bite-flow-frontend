import { ReactNode } from "react";

import { Role, UserProfile } from "./types";

// Shared authentication contract used across the application.
export interface AuthContextType {
  
  // Indicates whether a user is currently authenticated.
  isAuthenticated: boolean;

  // Stores the authenticated user's access token.
  token: string | null;

  // Stores authenticated user profile details.
  user: UserProfile | null;

  // Handles user login and stores authentication details.
  login: (
    token: string,
    user: UserProfile
  ) => void;

  // Handles user logout and clears authentication details.
  logout: () => void;

  // Checks whether the authenticated user has required roles.
  hasRole: (
    roles: Role[]
  ) => boolean;

  // Optional child components rendered inside the provider.
  children?: ReactNode;
}