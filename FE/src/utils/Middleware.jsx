import { Outlet } from "react-router-dom";

export default function Middleware() {
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }
  return <Outlet />;
}
