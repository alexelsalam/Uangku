import { Outlet } from "react-router-dom";
import { BottomNav } from "../components/layout/BottomNav";

export default function Middleware() {
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }
  return (
    <div className="relative ">
      {/* <Nav /> */}
      <Outlet />
      <BottomNav />
    </div>
  );
}
