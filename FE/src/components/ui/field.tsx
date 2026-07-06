import { AlertCircle, Mail } from "lucide-react";

export function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  rightSlot,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: typeof Mail;
  error?: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-bold text-[var(--color-ink-3)] uppercase tracking-wider mb-1.5">
        {label}
      </p>
      <div
        className={`flex items-center bg-[var(--color-surface)] border-[1.5px] rounded-xl px-3.5 transition-colors ${error ? "border-[var(--color-red)]" : "border-[var(--color-border)] focus-within:border-[var(--color-amber)]"}`}
      >
        <Icon
          size={16}
          color="var(--color-ink-3)"
          strokeWidth={1.75}
          className="flex-shrink-0 mr-2"
        />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 py-3 text-sm font-[family-name:var(--font-sans)] text-[var(--color-ink)] bg-transparent outline-none placeholder:text-[var(--color-ink-3)]"
        />
        {rightSlot}
      </div>
      {error && (
        <p className="flex items-center gap-1 mt-1.5 text-[11px] text-[var(--color-red)] font-semibold">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}
