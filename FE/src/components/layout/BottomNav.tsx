// import { cn } from '@/utils'
// import { useApp } from '@/hooks/useAppContext'
// import type { PageId } from '@/types'

import { useNavigate } from "react-router-dom";

interface NavItemDef {
  id: "home" | "report" | "add" | "categories" | "profile" | "detail";
  label: string;
  emoji: string;
  isFab?: boolean;
}

const NAV_ITEMS: NavItemDef[] = [
  { id: "home", label: "Beranda", emoji: "🏠" },
  { id: "report", label: "Laporan", emoji: "📊" },
  { id: "add", label: "Tambah", emoji: "＋", isFab: true },
  { id: "categories", label: "Kategori", emoji: "🗂" },
  { id: "profile", label: "Profil", emoji: "👤" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const currentPage = window.location.pathname.split(
    "/",
  )[1] as NavItemDef["id"];
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-end px-0 pt-2 pb-1 flex-shrink-0 ">
      {NAV_ITEMS.map((item) => {
        if (item.isFab) {
          return (
            <button
              key={item.id}
              onClick={() => navigate("add")}
              className="flex-1 flex flex-col items-center cursor-pointer z-10"
            >
              <div className="w-13 h-13 bg-[var(--color-ink)] rounded-[18px] flex items-center justify-center text-2xl text-[var(--color-bg)] -mt-7 shadow-[0_6px_20px_rgba(26,22,18,0.3)] active:scale-95 transition-transform">
                ＋
              </div>
              <span className="text-[9px] font-semibold text-[var(--color-amber)] mt-1">
                {item.label}
              </span>
            </button>
          );
        }
        const isActive =
          currentPage === item.id ||
          (currentPage === "detail" && item.id === "home");
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className="flex-1 flex flex-col items-center gap-0.5 pt-1 cursor-pointer transition-colors duration-150"
          >
            <span className="text-[22px] leading-none">{item.emoji}</span>
            <span
              className={`text-[9px] font-semibold mt-1 ${isActive ? "text-amber" : "text-[var(--color-ink-3)]"}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
