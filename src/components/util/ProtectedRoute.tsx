import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { ReactNode } from "react";

import { useAuth } from "../auth/AuthProvider";

import { Role } from "../model/types";

// Properties accepted by the protected route component.
type ProtectedRouteProps = {
  
  // Child components rendered after authorization succeeds.
  children: ReactNode;

  // Optional list of roles allowed to access the route.
  roles?: Role[];
};

// Route protection component for authentication and authorization checks.
export const ProtectedRoute = ({
  children,
  roles,
}: ProtectedRouteProps) => {
  
  // Retrieve authentication status and role validation function.
  const {
    isAuthenticated,
    hasRole,
  } = useAuth();
  
  // Retrieve current route location information.
  const location = useLocation();

  // Redirect unauthenticated users to the login page.
  if (!isAuthenticated) {
    
    // Preserve attempted route for post-login redirection.
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // Restrict access when user roles do not match allowed roles.
  if (
    roles &&
    !hasRole(roles)
  ) {
    
    // Redirect unauthorized users to the home page.
    return (
      <Navigate
        to="/home"
        replace
      />
    );
  }

  // Render protected child components after successful authorization.
  return <>{children}</>;
};