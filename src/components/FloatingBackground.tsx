import { useMemo } from "react";

type FloatItem = {
  id: string;
  kind: "petal" | "sparkle";
  left: string;
  top: string;
  duration: string;
  delay: string;
  sizePx: number;
  opacity: number;
  blurPx: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export default function FloatingBackground() {
  const items = useMemo<FloatItem[]>(() => {
    const out: FloatItem[] = [];
    for (let i = 0; i < 34; i++) {
      const size = rand(10, 26);
      out.push({
        id: `f-${i}`,
        kind: i % 4 === 0 ? "sparkle" : "petal",
        left: `${rand(0, 100).toFixed(2)}vw`,
        top: `${(-rand(0, 100)).toFixed(2)}vh`,
        duration: `${rand(8, 18).toFixed(2)}s`,
        delay: `${rand(0, 6).toFixed(2)}s`,
        sizePx: size,
        opacity: Number(rand(0.45, 0.9).toFixed(2)),
        blurPx: Number(rand(0, 0.6).toFixed(2)),
      });
    }
    return out;
  }, []);

  return (
    <div className="floating" aria-hidden="true">
      {items.map((it) => (
        <div
          key={it.id}
          className={it.kind}
          style={{
            left: it.left,
            top: it.top,
            width: `${it.sizePx}px`,
            height: `${it.sizePx}px`,
            animationDuration: it.duration,
            animationDelay: it.delay,
            opacity: it.opacity,
            filter: `blur(${it.blurPx}px)`,
          }}
        />
      ))}
    </div>
  );
}
