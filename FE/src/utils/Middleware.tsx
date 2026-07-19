import { Outlet } from "react-router-dom";
import { BottomNav } from "../components/layout/BottomNav";
import { isTokenExpired } from ".";

export default function Middleware() {
  const token = localStorage.getItem("token");

  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
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
