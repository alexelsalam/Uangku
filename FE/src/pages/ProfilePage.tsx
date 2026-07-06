import Logout from "../components/Logout";

export function ProfilePage() {
  interface MenuItem {
    emoji: string;
    bg: string;
    label: string;
    badge?: string;
    extra?: string;
  }
  const groups: { label: string; items: MenuItem[] }[] = [
    {
      label: "Akun",
      items: [
        { emoji: "👤", bg: "#fef3c7", label: "Edit Profil" },
        { emoji: "🔒", bg: "#fce7f3", label: "Ubah Password" },
        { emoji: "🔔", bg: "#ede9fe", label: "Notifikasi", badge: "Aktif" },
      ],
    },
    {
      label: "Data & Privasi",
      items: [
        { emoji: "📤", bg: "#dcfce7", label: "Export CSV" },
        { emoji: "📄", bg: "#fef9c3", label: "Export PDF" },
        { emoji: "☁", bg: "#e0f2fe", label: "Backup & Restore" },
      ],
    },
    {
      label: "Tampilan",
      items: [
        { emoji: "🌐", bg: "#f0fdf4", label: "Bahasa", extra: "Indonesia" },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto h-screen hide-scrollbar">
      <div className="px-5 pt-5 text-center">
        <div className="relative inline-block mb-3">
          <div className="w-[72px] h-[72px] rounded-[22px] bg-[var(--color-amber)] flex items-center justify-center text-3xl font-bold text-white mx-auto">
            AE
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--color-ink)] rounded-[7px] flex items-center justify-center text-[11px] text-[var(--color-bg)]">
            ✏
          </button>
        </div>
        <p className="text-xl font-bold text-[var(--color-ink)]">
          Alex Elsalam
        </p>
        <p className="text-sm text-[var(--color-ink-3)] mt-0.5 mb-5">
          alex@email.com
        </p>
      </div>

      <div className="px-5">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="text-[11px] font-bold text-[var(--color-ink-3)] uppercase tracking-wider pt-3 pb-2">
              {g.label}
            </p>
            {g.items.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 py-3.5 border-b border-[var(--color-border)] text-left active:bg-[var(--color-amber-light)] transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: item.bg }}
                >
                  {item.emoji}
                </div>
                <span className="flex-1 text-sm font-semibold text-[var(--color-ink)]">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-green-light)] text-[var(--color-green)] mr-1">
                    {item.badge}
                  </span>
                )}
                {item.extra && (
                  <span className="text-xs font-semibold text-[var(--color-ink-2)] mr-1">
                    {item.extra}
                  </span>
                )}
                <span className="text-sm text-[var(--color-ink-3)]">›</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      <Logout />
    </div>
  );
}
