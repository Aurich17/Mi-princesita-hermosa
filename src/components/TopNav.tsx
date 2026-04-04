import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(
    () => [
      { href: "#inicio", label: "Inicio" },
      { href: "#historia", label: "Historia" },
      { href: "#juego", label: "Juego" },
      { href: "#bebe", label: "Nuestro bebé" },
      { href: "#galeria", label: "Galería" },
      { href: "#carta", label: "Carta" },
    ],
    [],
  );

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-rose-100/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <a className="flex items-center gap-2" href="#inicio">
            <div className="rounded-2xl px-3 py-2 ">
              <img
                src="/gabi_logo.png"
                alt="Logo Gabi"
                className="h-10 w-auto origin-left scale-[1.55] object-contain sm:h-12 sm:scale-[4.7]"
                loading="lazy"
              />
            </div>
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-100/70 bg-white/70 text-rose-900/80 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 sm:hidden"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>

          <div
            className="hidden max-w-[70vw] items-center gap-4 overflow-x-auto text-sm font-medium text-rose-900/70 sm:flex sm:max-w-none"
            aria-label="Navegación"
          >
            {items.map((it) => (
              <a
                key={it.href}
                className="shrink-0 border-b border-transparent py-2 transition hover:border-rose-300 hover:text-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
                href={it.href}
              >
                {it.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/55 backdrop-blur-sm transition sm:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div
          ref={panelRef}
          className={cn(
            "absolute right-0 top-0 h-full w-[86vw] max-w-[360px] overflow-hidden bg-white shadow-2xl transition-transform",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="relative border-b border-rose-100/70 px-5 py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-rose-50">
                  <img
                    src="/gabi_logo.png"
                    alt="Logo"
                    className="h-7 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-sm font-black text-rose-950">Menú</div>
                  <div className="text-xs font-semibold text-rose-900/60">
                    Elige una sección
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-100/70 bg-white text-rose-900/80 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-rose-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -left-12 -bottom-16 h-44 w-44 rounded-full bg-pink-200/35 blur-3xl" />
          </div>

          <div className="px-4 py-4">
            <div className="grid gap-2">
              {items.map((it) => (
                <a
                  key={it.href}
                  className="flex items-center justify-between rounded-2xl border border-rose-100/70 bg-white px-4 py-3 text-sm font-semibold text-rose-950 shadow-sm transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
                  href={it.href}
                  onClick={() => setOpen(false)}
                >
                  <span>{it.label}</span>
                  <span className="text-rose-300">›</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
