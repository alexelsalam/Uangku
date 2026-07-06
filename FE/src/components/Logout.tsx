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
    <button
      onClick={handleLogout}
      className="mx-5 mt-5 mb-25 w-[calc(100%-40px)] bg-[var(--color-red-light)] border-[1.5px] border-[#f5c6c2] text-[var(--color-red)] rounded-[14px] py-3.5 text-sm font-bold"
    >
      Keluar
    </button>
  );
}
