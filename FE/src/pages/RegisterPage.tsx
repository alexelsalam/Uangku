import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Field } from "../components/ui/field";
import { validateRegister } from "../utils/authUtils";
import apiAuth from "../api/apiAuth";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showCon, setShowCon] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit() {
    const errs = validateRegister(name, email, password, confirm);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    // TODO: ganti dengan Supabase Auth
    // const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
    try {
      const result = await apiAuth("/authRegister", {
        username: email,
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
  }

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg)] hide-scrollbar">
      {/* Top */}
      <div className="bg-[var(--color-ink)] px-6 pt-14 pb-8 relative overflow-hidden flex-shrink-0">
        <div
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(201,131,42,0.2) 0%, transparent 70%)",
          }}
        />
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1.5 text-[#7a6a5a] text-xs font-semibold mb-4"
        >
          ‹ Sudah punya akun
        </button>
        <p className="text-[var(--color-amber)] text-sm font-bold tracking-widest uppercase mb-2">
          Mulai sekarang
        </p>
        <h1 className="text-3xl font-bold text-[#f7f2ea] tracking-tight">
          Buat akun
          <br />
          Uangku
        </h1>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-6 pt-8">
        <Field
          label="Nama Lengkap"
          type="text"
          value={name}
          onChange={(v) => {
            setName(v);
            setErrors((p) => ({ ...p, name: "" }));
          }}
          placeholder="Alex Elsalam"
          icon={User}
          error={errors.name}
        />

        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(v) => {
            setEmail(v);
            setErrors((p) => ({ ...p, email: "" }));
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
            setErrors((p) => ({ ...p, password: "" }));
          }}
          placeholder="Minimal 6 karakter"
          icon={Lock}
          error={errors.password}
          rightSlot={
            <button
              onClick={() => setShowPass((p) => !p)}
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

        {/* Password strength */}
        {password.length > 0 && (
          <div className="mb-4 -mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full transition-colors"
                  style={{
                    backgroundColor:
                      password.length >= i * 3
                        ? i <= 2
                          ? "#d97706"
                          : "#27784a"
                        : "var(--color-border)",
                  }}
                />
              ))}
            </div>
            <p
              className="text-[10px] font-semibold"
              style={{
                color:
                  password.length < 6
                    ? "#d97706"
                    : password.length < 10
                      ? "#c9832a"
                      : "#27784a",
              }}
            >
              {password.length < 6
                ? "Terlalu pendek"
                : password.length < 10
                  ? "Cukup"
                  : "Kuat"}
            </p>
          </div>
        )}

        <Field
          label="Konfirmasi Password"
          type={showCon ? "text" : "password"}
          value={confirm}
          onChange={(v) => {
            setConfirm(v);
            setErrors((p) => ({ ...p, confirm: "" }));
          }}
          placeholder="Ulangi password"
          icon={Lock}
          error={errors.confirm}
          rightSlot={
            <button
              onClick={() => setShowCon((p) => !p)}
              className="ml-2 flex-shrink-0"
            >
              {showCon ? (
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

        <p className="text-[11px] text-[var(--color-ink-3)] leading-relaxed mb-6">
          Dengan mendaftar, kamu setuju dengan{" "}
          <span className="text-[var(--color-amber)] font-semibold">
            Syarat & Ketentuan
          </span>{" "}
          dan{" "}
          <span className="text-[var(--color-amber)] font-semibold">
            Kebijakan Privasi
          </span>{" "}
          Uangku.
        </p>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-4 rounded-[14px] text-base font-bold transition-all
            ${
              loading
                ? "bg-[var(--color-border)] text-[var(--color-ink-3)] cursor-not-allowed"
                : "bg-[var(--color-ink)] text-[var(--color-bg)] active:bg-[var(--color-amber)]"
            }`}
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>

        <div className="h-8" />
      </div>
    </div>
  );
}
