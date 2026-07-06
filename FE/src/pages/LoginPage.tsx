import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Field } from "../components/ui/field";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateLogin } from "../utils/authUtils";
import apiAuth from "../api/apiAuth";

export function LoginPage() {
  //   const { navigate, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit() {
    if (email !== "elsalam") {
      const errs = validateLogin(email, password);
      setErrors(errs);
      if (Object.keys(errs).length) return;
    }
    setLoading(true);

    try {
      const data = await apiAuth("/authLogin", {
        username: email,
        password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/home";
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please check your credentials.");
      return;
    }
  }

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg)] hide-scrollbar">
      {/* Top decoration */}
      <div className="bg-[var(--color-ink)] px-6 pt-16 pb-10 relative overflow-hidden flex-shrink-0">
        <div
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(201,131,42,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(201,131,42,0.1) 0%, transparent 70%)",
          }}
        />
        <p className="text-[var(--color-amber)] text-sm font-bold tracking-widest uppercase mb-2">
          Selamat datang
        </p>
        <h1 className="text-3xl font-bold text-[#f7f2ea] tracking-tight">
          Masuk ke
          <br />
          Uangku
        </h1>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-6 pt-8">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(v) => {
            setEmail(v);
            setErrors((p: Record<string, string>) => ({ ...p, email: "" }));
          }}
          placeholder="kamu@email.com"
          icon={Mail}
          error={errors.email}
        />

        <Field
          label="Password"
          type={showPass ? "text" : "password"}
          value={password}
          onChange={(v) => {
            setPassword(v);
            setErrors((p: Record<string, string>) => ({ ...p, password: "" }));
          }}
          placeholder="Minimal 6 karakter"
          icon={Lock}
          error={errors.password}
          rightSlot={
            <button
              onClick={() => setShowPass((p: boolean) => !p)}
              className="ml-2 flex-shrink-0"
            >
              {showPass ? (
                <EyeOff
                  size={16}
                  color="var(--color-ink-3)"
                  strokeWidth={1.75}
                />
              ) : (
                <Eye size={16} color="var(--color-ink-3)" strokeWidth={1.75} />
              )}
            </button>
          }
        />

        <button
          //   onClick={() => showToast("📧 Link reset dikirim ke email")}
          className="text-xs font-semibold text-[var(--color-amber)] mb-6 block"
        >
          Lupa password?
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-4 rounded-[14px] text-base font-bold transition-all mb-4
            ${
              loading
                ? "bg-[var(--color-border)] text-[var(--color-ink-3)] cursor-not-allowed"
                : "bg-[var(--color-ink)] text-[var(--color-bg)] active:bg-[var(--color-amber)]"
            }`}
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-xs text-[var(--color-ink-3)] font-semibold">
            atau
          </span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        <button
          onClick={() => navigate("/register")}
          className="w-full py-4 rounded-[14px] text-base font-bold border-[1.5px] border-[var(--color-border)] text-[var(--color-ink-2)] active:bg-[var(--color-amber-light)] active:border-[var(--color-amber)] transition-colors"
        >
          Buat akun baru
        </button>

        <div className="h-8" />
      </div>
    </div>
  );
}
