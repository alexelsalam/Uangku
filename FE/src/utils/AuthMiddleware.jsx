import { Outlet } from "react-router-dom";

export default function AuthMiddleware() {
  const isAuthenticated = localStorage.getItem("token");
  if (
    isAuthenticated &&
    window.location.pathname === "/login" &&
    window.location.pathname === "/register"
  ) {
    window.location.href = "/home";
    return null;
  }
  return <Outlet />;
}
