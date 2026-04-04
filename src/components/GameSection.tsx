import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameMemory } from "@/data/content";
import { cn } from "@/lib/utils";

type Props = {
  memories: GameMemory[];
};

type Cell = {
  id: string;
  isCapy: boolean;
  kind: "capy" | "tulip" | "sunflower";
  imgSrc: string;
};

const capyImages = [
  "/juego/capibara.jpg",
  "/juego/capibara2.jpg",
  "/juego/capibara3.jpg",
  "/juego/capibara4.webp",
];

const tulipImages = [
  "/juego/tulipan.webp",
  "/juego/tulipan2.jpg",
  "/juego/tulipan3.webp",
];

const sunflowerImages = [
  "/juego/girasol.webp",
  "/juego/girasol2.jpg",
  "/juego/girasol3.jpg",
];

const randInt = (max: number) => Math.floor(Math.random() * max);

export default function GameSection({ memories }: Props) {
  const [gameIndex, setGameIndex] = useState(-1);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [gridSize, setGridSize] = useState(4);
  const [cells, setCells] = useState<Cell[]>([]);
  const [failedIds, setFailedIds] = useState<Set<string>>(() => new Set());
  const [status, setStatus] = useState(
    "Pulsa empezar y descubre algo bonito…",
  );
  const [hint, setHint] = useState("Cuando aciertes, se abrirá un recuerdo.");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [imgOk, setImgOk] = useState(true);
  const [autoNext, setAutoNext] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const capyRotateRef = useRef(0);
  const tulipRotateRef = useRef(0);
  const sunflowerRotateRef = useRef(0);

  const hasNext = started && gameIndex < memories.length - 1;

  const buildGrid = (size: number) => {
    const total = size * size;
    const capyPos = randInt(total);
    const next: Cell[] = [];

    const capySrc = capyImages[capyRotateRef.current % capyImages.length];
    capyRotateRef.current += 1;

    for (let i = 0; i < total; i++) {
      const isCapy = i === capyPos;
      if (isCapy) {
        next.push({
          id: `c-${Date.now()}-${i}`,
          isCapy: true,
          kind: "capy",
          imgSrc: capySrc,
        });
        continue;
      }

      const preferTulip = i % 2 === 0;
      const useTulip = preferTulip || sunflowerImages.length === 0;
      if (useTulip && tulipImages.length > 0) {
        const src = tulipImages[tulipRotateRef.current % tulipImages.length];
        tulipRotateRef.current += 1;
        next.push({
          id: `c-${Date.now()}-${i}`,
          isCapy: false,
          kind: "tulip",
          imgSrc: src,
        });
        continue;
      }

      const src = sunflowerImages[
        sunflowerRotateRef.current % sunflowerImages.length
      ];
      sunflowerRotateRef.current += 1;
      next.push({
        id: `c-${Date.now()}-${i}`,
        isCapy: false,
        kind: "sunflower",
        imgSrc: src,
      });
    }
    setFailedIds(new Set());
    setCells(next);
  };

  const gridSizeForIndex = useCallback((idx: number) => {
    return Math.min(4 + Math.floor(idx / 2), 5);
  }, []);

  const startChallenge = useCallback(
    (targetIndex: number) => {
      const size = gridSizeForIndex(targetIndex);
      setGridSize(size);
      setReady(true);
      setStatus(`Reto para desbloquear el mensaje ${targetIndex + 1}.`);
      setHint(`Encuentra el capibara en la cuadrícula (${size}×${size}).`);
      buildGrid(size);
    },
    [gridSizeForIndex],
  );

  const openMemory = (idx: number) => {
    setModalIndex(idx);
    setImgOk(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (!modalOpen && autoNext && hasNext) {
      setAutoNext(false);
      startChallenge(gameIndex + 1);
    }
  }, [autoNext, gameIndex, hasNext, modalOpen, startChallenge]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalOpen) closeModal();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  useEffect(() => {
    buildGrid(4);
  }, []);

  const modalMemory = useMemo(() => {
    if (modalIndex == null) return null;
    return memories[modalIndex] ?? null;
  }, [memories, modalIndex]);

  return (
    <section className="py-12 sm:py-14" id="juego">
      <h2 className="text-xl font-semibold tracking-tight text-rose-950 sm:text-2xl">
        Mini‑juego
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-rose-900/70 sm:text-base">
        Avanza por el caminito, supera un reto sencillo y en cada paso se abre
        un momento.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-white/60 p-5 shadow-sm sm:p-6">
          <div className="text-sm font-black text-rose-950">
            Momentos contigo
          </div>
          <div
            className="mt-4 flex flex-wrap gap-3"
            aria-label="Momentos contigo"
          >
            {memories.map((m, idx) => {
              const unlocked = started && idx <= gameIndex;
              const isActive = idx === gameIndex;
              return (
                <button
                  key={m.id}
                  type="button"
                  className={cn(
                    "relative h-[84px] w-[84px] overflow-hidden rounded-3xl border text-center shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70",
                    unlocked
                      ? "border-rose-100/80 bg-white/75 hover:-translate-y-1 hover:bg-rose-50"
                      : "cursor-not-allowed border-rose-100/60 bg-white/40 opacity-50",
                    isActive ? "ring-2 ring-rose-300/70" : "",
                  )}
                  disabled={!unlocked}
                  aria-label={`${m.title}: ${m.subtitle}`}
                  onClick={() => {
                    if (unlocked) openMemory(idx);
                  }}
                >
                  {m.img ? (
                    <>
                      <img
                        src={m.img}
                        alt={m.subtitle}
                        className="absolute inset-0 h-full w-full object-cover blur-sm"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-white/25" />
                    </>
                  ) : (
                    <div className="grid h-full w-full place-items-center px-2">
                      <span className="text-sm font-semibold text-rose-900/70">
                        {idx + 1}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(244,63,94,0.25)] transition hover:-translate-y-0.5 hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
              type="button"
              onClick={() => {
                setStarted(true);
                setGameIndex(-1);
                setReady(false);
                setAutoNext(false);
                startChallenge(0);
              }}
            >
              Empezar
            </button>
            <button
              className="inline-flex items-center justify-center rounded-full border border-rose-100/80 bg-white/70 px-5 py-2.5 text-sm font-semibold text-rose-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
              type="button"
              onClick={() => {
                setStarted(false);
                setAutoNext(false);
                setGameIndex(-1);
                setReady(false);
                setStatus("Pulsa empezar y descubre algo bonito…");
                setHint("Cuando aciertes, se abrirá un recuerdo.");
                setGridSize(4);
                buildGrid(4);
              }}
            >
              Reiniciar
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-rose-100/70 bg-gradient-to-br from-rose-50/70 to-white px-4 py-3 text-sm font-semibold text-rose-900/70">
            {status}
          </div>
        </div>

        <div className="rounded-2xl bg-white/60 p-5 shadow-sm sm:p-6">
          <div className="text-sm font-black text-rose-950">
            Reto: encuentra al capibara
          </div>
          <div
            className="mt-4 grid gap-2"
            role="grid"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {cells.map((c) => (
              <button
                key={c.id}
                type="button"
                className={cn(
                  "relative aspect-square w-full overflow-hidden rounded-2xl border border-rose-100/70 bg-white/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70",
                  failedIds.has(c.id) ? "bg-rose-100/60" : "",
                  !ready ? "cursor-not-allowed opacity-80" : "",
                )}
                aria-label={c.isCapy ? "Capibara" : "Flor"}
                onClick={() => {
                  if (!ready) return;

                  if (!c.isCapy) {
                    setFailedIds((prev) => {
                      const next = new Set(prev);
                      next.add(c.id);
                      return next;
                    });
                    setStatus("Casi… intenta otra vez.");
                    return;
                  }

                  setReady(false);
                  const nextIndex = Math.min(
                    gameIndex + 1,
                    memories.length - 1,
                  );
                  setGameIndex(nextIndex);
                  setStatus(
                    `¡Bien! Desbloqueaste el mensaje ${nextIndex + 1}.`,
                  );
                  if (nextIndex < memories.length - 1) {
                    setAutoNext(true);
                  } else {
                    setAutoNext(false);
                  }
                  openMemory(nextIndex);
                }}
              >
                <img
                  src={c.imgSrc}
                  alt={
                    c.isCapy
                      ? "Capibara"
                      : c.kind === "tulip"
                        ? "Tulipán"
                        : "Girasol"
                  }
                  className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm font-semibold leading-relaxed text-rose-900/70">
            {hint}
          </div>
        </div>
      </div>

      {modalOpen ? (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 grid place-items-center bg-rose-950/30 p-4 backdrop-blur-sm"
          aria-hidden={!modalOpen}
          onClick={(e) => {
            if (e.target === modalRef.current) closeModal();
          }}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/60 bg-white/85 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between gap-4 border-b border-rose-100/70 px-5 py-4">
              <h3 className="text-base font-black text-rose-950 sm:text-lg">
                {modalMemory ? modalMemory.title : "Recuerdo"}
              </h3>
              <button
                className="rounded-full border border-rose-100/80 bg-white/70 px-4 py-2 text-sm font-semibold text-rose-900 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
                type="button"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <div className="overflow-hidden rounded-3xl border border-rose-100/70 bg-gradient-to-br from-rose-50/70 to-white shadow-sm">
                <div className="aspect-[4/3] w-full">
                  {modalMemory?.img ? (
                    <>
                      {!imgOk ? (
                        <div className="grid h-full w-full place-items-center px-6 text-center text-sm font-semibold text-rose-900/60">
                          Aquí irá una foto cuando agregues el archivo.
                        </div>
                      ) : null}
                      <div className="relative h-full w-full bg-white">
                        <img
                          src={modalMemory.img}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
                          style={imgOk ? { opacity: 0.6 } : { display: "none" }}
                        />
                        <img
                          src={modalMemory.img}
                          alt={`${modalMemory.title} - ${modalMemory.subtitle}`}
                          onLoad={() => setImgOk(true)}
                          onError={() => setImgOk(false)}
                          className="relative h-full w-full object-contain"
                          style={imgOk ? undefined : { display: "none" }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="grid h-full w-full place-items-center px-6 text-center text-sm font-semibold text-rose-900/60">
                      Aquí irá una foto cuando agregues el archivo.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-rose-100/70 bg-white/70 p-5 shadow-sm">
                <div className="text-sm font-black text-rose-950">
                  {modalMemory?.subtitle ?? ""}
                </div>
                <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-relaxed text-rose-900/70">
                  {modalMemory?.text ?? ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
