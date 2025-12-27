import { useState, useRef, useEffect } from "react";

export default function CustomSelectCategory({
  options = [],
  value = "",
  onChange = () => {},
  className = "",
  outlineClass = "focus:ring-2 focus:ring-[#00CBA9] focus:outline-none",
  placeholder = "Pilih...",
  //   enterDuration = 220,
  exitDuration = 180,
}) {
  const [open, setOpen] = useState(false);
  const [renderList, setRenderList] = useState(false);
  const [closing, setClosing] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (open) {
      setRenderList(true);
      setClosing(false);
    } else if (renderList) {
      setClosing(true);
      const t = setTimeout(() => {
        setRenderList(false);
        setClosing(false);
      }, exitDuration);
      return () => clearTimeout(t);
    }
  }, [open, renderList, exitDuration]);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`w-full bg-[#222] text-white rounded-md p-2 flex items-center justify-between ${outlineClass}`}
      >
        <span className="truncate">
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {renderList && (
        <ul
          role="listbox"
          className={`absolute left-0 right-0 mt-2 bg-black/95 rounded-md shadow-lg max-h-56 overflow-auto z-50 flex flex-wrap gap-8 py-2.5 ${
            open
              ? "animate-dropdown-enter"
              : closing
              ? "animate-dropdown-exit"
              : ""
          }`}
        >
          {options.map((opt) => (
            <div
              className="flex items-center gap-2 flex-col justify-center w-1/4 cursor-pointer"
              key={opt.value}
            >
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                style={{ backgroundColor: opt.color }}
                className={`h-8 w-8 cursor-pointer hover:bg-[#333] transition-colors rounded-full flex items-center justify-center ${
                  opt.value === value
                    ? "bg-[#111] text-[#00CBA9]"
                    : "text-white"
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.icon}
              </li>
              <p>{opt.value}</p>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
