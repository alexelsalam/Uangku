import { useApp } from "../../hooks/useAppContext";

export function Toast() {
  const { toast } = useApp();
  return (
    <div
      className={`absolute bottom-24 left-4 right-4 z-50 bg-[var(--color-ink)] text-[var(--color-bg)] px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 pointer-events-none transition-all duration-300 ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      {toast.message}
    </div>
  );
}
