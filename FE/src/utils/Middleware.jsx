import { Outlet } from "react-router-dom";
import { Nav } from "../components/Nav";

export default function Middleware() {
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }
  return (
    <>
      <Nav />
      <Outlet />;
    </>
  );
}
