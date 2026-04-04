import { useEffect, useRef, useState } from "react";
import { heroCopy } from "@/data/content";

export default function Hero() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicHint, setMusicHint] = useState<string | null>(null);
  // const [needsInteraction, setNeedsInteraction] = useState(false);

  const musicSrc = encodeURI("/León Larregui - Brillas (Video Oficial).mp3");
  const musicStartSeconds = 13;

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const waitForMetadata = async () => {
      if (el.readyState >= 1) return;
      await new Promise<void>((resolve) => {
        const onLoaded = () => {
          el.removeEventListener("loadedmetadata", onLoaded);
          resolve();
        };
        el.addEventListener("loadedmetadata", onLoaded);
      });
    };

    const seekToStart = () => {
      try {
        const hasDuration = Number.isFinite(el.duration) && el.duration > 0;
        if (hasDuration && el.duration > musicStartSeconds) {
          el.currentTime = musicStartSeconds;
        } else {
          el.currentTime = 0;
        }
      } catch {
        return;
      }
    };

    const enableSound = async () => {
      try {
        el.muted = false;
        el.volume = 1;
        await el.play();
        // setNeedsInteraction(false);
        setMusicHint(null);
      } catch {
        return;
      }
    };

    (async () => {
      try {
        await waitForMetadata();
        seekToStart();

        el.muted = false;
        el.volume = 1;
        await el.play();
        // setNeedsInteraction(false);
        setMusicHint(null);
      } catch {
        try {
          el.muted = true;
          el.volume = 0;
          await waitForMetadata();
          seekToStart();
          await el.play();
          // setNeedsInteraction(true);
        } catch {
          // setNeedsInteraction(true);
        }
      }
    })();

    const onInteract = () => {
      enableSound();
    };

    window.addEventListener("pointerdown", onInteract, { once: true });
    window.addEventListener("keydown", onInteract, { once: true });

    return () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
    };
  }, []);

  return (
    <header
      id="inicio"
      className="relative z-10 w-full border-b border-rose-100/70 bg-gradient-to-b from-rose-50/80 via-white to-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700/70">
              {heroCopy.badge}
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-rose-950 sm:text-6xl">
              {heroCopy.titlePrefix}
              <span className="text-rose-500">{heroCopy.titleName}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-rose-900/70">
              {heroCopy.lead}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(244,63,94,0.22)] transition hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
                href="#historia"
              >
                Ver historia
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-rose-200/70 bg-white px-6 py-3 text-sm font-semibold text-rose-900 shadow-sm transition hover:border-rose-300 hover:bg-rose-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
                href="#carta"
              >
                Leer carta
              </a>
            </div>

            {musicHint ? (
              <p className="mt-4 text-sm font-semibold text-rose-700">
                {musicHint}
              </p>
            ) : null}

            <audio ref={audioRef} preload="metadata" className="hidden">
              <source src={musicSrc} type="audio/mpeg" />
              Tu navegador no soporta audio.
            </audio>
          </section>

          <aside className="relative overflow-hidden rounded-3xl bg-white/60 shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-100/70 via-white to-white" />
            <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-rose-200/45 blur-3xl" />
            <div className="absolute -left-28 -bottom-28 h-80 w-80 rounded-full bg-pink-200/35 blur-3xl" />
            <div className="relative aspect-[4/5] w-full">
              <img
                src="/gabi/princesa.jpeg"
                alt="Gabi, mi princesita"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/70 to-transparent" />
            </div>
          </aside>
        </div>
      </div>
    </header>
  );
}
