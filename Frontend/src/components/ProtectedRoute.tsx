import { Navigate } from "react-router";
import { JSX, useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/" replace />; // ✅ Just redirect to homepage
  }

  return children;
};
