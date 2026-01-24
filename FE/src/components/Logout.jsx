import IconLogOut from "../icons/IconLogout.jsx";

export default function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login page
  };

  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Math.floor(Date.now() / 1000);
  if (payload.exp < currentTime) {
    handleLogout(); // Automatically logout if token is expired
  }
  return (
    <button onClick={handleLogout} className=" ">
      <IconLogOut />
    </button>
  );
}
