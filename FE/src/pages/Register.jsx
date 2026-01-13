import apiAuth from "../api/apiAuth.js";

export default function Register() {
  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const result = await apiAuth("/authRegister", {
        username,
        password,
      });
      if (!result) {
        throw new Error("Registration failed");
      }
      alert("Registration successful!");
      window.location.href = "/login"; // Redirect to login page after successful registration
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed. Please try again.");
    }
  };
  return (
    <div className=" h-screen bg-black md:w-sm md:mx-auto md:rounded-lg md:shadow-lg">
      <div className="relative bg-primary h-1/6"></div>
      {/* wave vektor */}
      <div className="-mt-1">
        <img src="/vector.svg" alt="wave-vektor" className="w-full" />
      </div>
      <div className="mt-6 border-2 rounded-2xl border-primary w-[337px] h-[383px] mx-auto drop-shadow-[0_0_10px_#00cba9]">
        <p className="text-primary font-light  text-4xl text-center pt-10">
          DAFTAR
        </p>
        <form
          onSubmit={handleRegister}
          className="text-white flex flex-col gap-3.5 justify-center items-center mt-5"
        >
          <label htmlFor="username" className="">
            <input
              type="text"
              id="username"
              placeholder="username"
              name="username"
              className=" w-2xs h-[50px] rounded-full bg-transparent outline-none border-2 border-[#E2E0E0]  focus:border-primary pl-5"
            />
          </label>
          <label htmlFor="password" className="">
            <input
              type="text"
              id="password"
              placeholder="password"
              name="password"
              className="w-2xs h-[50px] rounded-full bg-transparent outline-none border-2 border-[#E2E0E0]  focus:border-primary pl-5"
            />
          </label>
          <button
            type="submit"
            className="w-2xs border-2 border-[#00B89F] text-white hover:text-black font-medium rounded-full p-2 mt-16 hover:bg-[#00B89F] transition-colors duration-300"
          >
            Daftar
          </button>
        </form>
        <p className="text-white text-center mt-5">
          Sudah punya akun?{" "}
          <a className="text-primary" href="/login">
            Masuk
          </a>
        </p>
      </div>
    </div>
  );
}
// This is a simple login page component using React and Tailwind CSS.
// It includes fields for email and password, a submit button, and a link to the registration page.
