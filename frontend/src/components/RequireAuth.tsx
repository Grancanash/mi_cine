import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

function RequireAuth({isLoggedIn, children}: { isLoggedIn: boolean; children: ReactNode }) {
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default RequireAuth;
