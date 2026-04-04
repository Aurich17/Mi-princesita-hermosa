import { useMemo, useRef, useState } from "react";

type Burst = {
  id: string;
  leftPx: number;
  topPx: number;
  dxPx: number;
  dyPx: number;
};

export default function InfoGrid() {
  const [revealed, setRevealed] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const hiddenMessage = useMemo(
    () =>
      "🌼 Hoy quiero recordarte lo importante que eres para mí. Te amo y valoro todo lo que somos: tú, yo, nosotros… y el bebé que estamos esperando. 🦫🌷",
    [],
  );

  const spawnBursts = () => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const next: Burst[] = [];
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 140;
      next.push({
        id: `b-${Date.now()}-${i}`,
        leftPx: x,
        topPx: y,
        dxPx: Math.cos(angle) * dist,
        dyPx: Math.sin(angle) * dist,
      });
    }
    setBursts((prev) => [...prev, ...next]);
  };

  return (
    <section
      className="py-12 sm:py-14"
      aria-label="Detalles"
      id="detalles"
    >
      <div className="grid gap-10 md:grid-cols-3">
        <article>
          <h2 className="text-sm font-semibold tracking-tight text-rose-950">
            Cosas que le gustan
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-rose-900/70">
            {["Tulipanes que llenan todo de color.", "Capibaras tiernos y tranquilos.", "Flores rositas, suaves y estéticas."].map(
              (t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-300" />
                  <span>{t}</span>
                </li>
              ),
            )}
          </ul>
        </article>

        <article>
          <h2 className="text-sm font-semibold tracking-tight text-rose-950">
            Detalles bonitos
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-rose-900/70">
            {["Un diseño rosita, delicado y elegante.", "Mensajes especiales bonitos y dedicados.", "Espacio para fotos y recuerdos."].map(
              (t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-300" />
                  <span>{t}</span>
                </li>
              ),
            )}
          </ul>
        </article>

        <article>
          <h2 className="text-sm font-semibold tracking-tight text-rose-950">
            Sorpresa
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-rose-900/70">
            Haz clic para abrir una sorpresa.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              ref={btnRef}
              className="inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(244,63,94,0.22)] transition hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
              type="button"
              onClick={() => {
                setRevealed(true);
                spawnBursts();
              }}
            >
              {revealed ? "Sorpresa abierta" : "Abrir sorpresa"}
            </button>
            <span className="text-xs font-medium text-rose-900/55">
              (prometo que es un detalle lindo)
            </span>
          </div>
          {revealed ? (
            <div className="mt-4 rounded-2xl bg-white/60 px-4 py-3 text-sm leading-relaxed text-rose-900/75">
              {hiddenMessage}
            </div>
          ) : null}
        </article>
      </div>

      {bursts.map((b) => (
        <div
          key={b.id}
          className="burst"
          style={
            {
              left: `${b.leftPx}px`,
              top: `${b.topPx}px`,
              "--dx": `${b.dxPx.toFixed(1)}px`,
              "--dy": `${b.dyPx.toFixed(1)}px`,
            } as React.CSSProperties
          }
          onAnimationEnd={() => {
            setBursts((prev) => prev.filter((x) => x.id !== b.id));
          }}
        />
      ))}
    </section>
  );
}
