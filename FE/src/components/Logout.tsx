import IconLogOut from "../icons/IconLogout.js";

export default function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login page
  };

  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        handleLogout();
      }
    } catch (error) {
      console.error("Invalid token format", error);
      handleLogout();
    }
  }
  return (
    <button onClick={handleLogout} className=" ">
      <IconLogOut />
    </button>
  );
}
