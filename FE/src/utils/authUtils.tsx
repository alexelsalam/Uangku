// ─── Validate ─────────────────────────────────────────────────────────────────
export function validateLogin(email: string, password: string) {
  const errs: Record<string, string> = {};
  if (!email) errs.email = "Email wajib diisi";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errs.email = "Format email tidak valid";
  if (!password) errs.password = "Password wajib diisi";
  else if (password.length < 6) errs.password = "Password minimal 6 karakter";
  return errs;
}

export function validateRegister(
  name: string,
  email: string,
  password: string,
  confirm: string,
) {
  const errs: Record<string, string> = {};
  if (!name.trim()) errs.name = "Nama wajib diisi";
  else if (name.trim().length < 2) errs.name = "Nama minimal 2 karakter";
  if (!email) errs.email = "Email wajib diisi";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errs.email = "Format email tidak valid";
  if (!password) errs.password = "Password wajib diisi";
  else if (password.length < 6) errs.password = "Password minimal 6 karakter";
  if (!confirm) errs.confirm = "Konfirmasi password wajib diisi";
  else if (confirm !== password) errs.confirm = "Password tidak cocok";
  return errs;
}
