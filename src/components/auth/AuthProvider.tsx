import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import { AuthContextType } from "../model/AuthContextType";

import { Role, UserProfile } from "../model/types";

// Local storage key used for storing authentication details.
const STORAGE_KEY = "food-ordering-auth";

// Structure of authentication data stored in local storage.
type StoredAuth = {
  token: string;
  user: UserProfile;
};

// Create authentication context for sharing auth state across the application.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Retrieve stored authentication data from local storage.
const readStoredAuth = (): StoredAuth | null => {
  
  // Read stored authentication data using the storage key.
  const raw = localStorage.getItem(STORAGE_KEY);

  // Return null if no authentication data exists.
  if (!raw) {
    return null;
  }

  try {
    // Parse and return stored authentication data.
    return JSON.parse(raw) as StoredAuth;
  } catch {
    
    // Remove corrupted authentication data from local storage.
    localStorage.removeItem(STORAGE_KEY);

    // Return null when parsing fails.
    return null;
  }
};

// Retrieve stored token for attaching authorization headers to API requests.
export const getStoredToken = () => readStoredAuth()?.token ?? null;

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  
  // Retrieve existing authentication data during application startup.
  const storedAuth = readStoredAuth();
  
  // Store authentication token in component state.
  const [token, setToken] = useState<string | null>(
    storedAuth?.token ?? null
  );
  
  // Store authenticated user details in component state.
  const [user, setUser] = useState<UserProfile | null>(
    storedAuth?.user ?? null
  );

  // Save authentication data after successful login.
  const login = (nextToken: string, nextUser: UserProfile) => {
    
    // Store token and user details in local storage.
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: nextToken,
        user: nextUser,
      })
    );

    // Update token state.
    setToken(nextToken);

    // Update authenticated user state.
    setUser(nextUser);
  };

  // Clear authentication data during logout.
  const logout = () => {
    
    // Remove stored authentication data from local storage.
    localStorage.removeItem(STORAGE_KEY);

    // Clear token state.
    setToken(null);

    // Clear authenticated user state.
    setUser(null);
  };

  // Create shared authentication context value.
  const value = useMemo<AuthContextType>(
    () => ({
      
      // Check whether the user is currently authenticated.
      isAuthenticated: Boolean(token && user),

      token,

      user,

      login,

      logout,

      // Check whether the authenticated user has one of the required roles.
      hasRole: (roles: Role[]) =>
        Boolean(user && roles.includes(user.role)),
    }),
    [token, user]
  );

  // Provide authentication context to all child components.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook used for accessing authentication context.
export const useAuth = () => {
  
  // Retrieve authentication context value.
  const context = useContext(AuthContext);

  // Throw error if hook is used outside the provider.
  if (!context) {
    throw new Error("Auth context is unavailable");
  }

  // Return authentication context value.
  return context;
};