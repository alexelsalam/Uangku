import IconLogOut from "../icons/IconLogout.jsx";

export default function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login page
  };
  return (
    <button onClick={handleLogout} className=" ">
      <IconLogOut />
    </button>
  );
}
