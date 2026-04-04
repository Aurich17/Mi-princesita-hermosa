import { useEffect, useMemo, useState } from "react";

type BabyItem = {
  id: string;
  title: string;
  text: string;
};

type PregnancyMonthSize = {
  month: number;
  startWeek: number;
  endWeek: number;
  label: string;
  img?: string;
};

type Props = {
  items: BabyItem[];
  tracker?: {
    timeZone: string;
    anchorDate: string;
    anchorWeeks: number;
  };
  monthSizes?: PregnancyMonthSize[];
};

type WeekState = {
  weeks: number;
  daysIntoWeek: number;
  todayText: string;
  nextText: string;
  nextWeeks: number;
  daysUntilNext: number;
  progress: number;
};

function getDatePartsInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);

  return { year, month, day };
}

function toUtcDayStamp(year: number, month: number, day: number) {
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

function parseIsoDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map((v) => Number(v));
  return { year: y, month: m, day: d };
}

function computeWeeks(
  now: Date,
  tracker: NonNullable<Props["tracker"]>,
): WeekState {
  const anchor = parseIsoDate(tracker.anchorDate);
  const nowParts = getDatePartsInTimeZone(now, tracker.timeZone);

  const anchorStamp = toUtcDayStamp(anchor.year, anchor.month, anchor.day);
  const nowStamp = toUtcDayStamp(nowParts.year, nowParts.month, nowParts.day);

  const rawDiffDays = nowStamp - anchorStamp;
  const diffDays = Math.max(0, rawDiffDays);
  const weekDelta = Math.floor(diffDays / 7);
  const weeks = Math.max(0, tracker.anchorWeeks + weekDelta);
  const daysIntoWeek = diffDays % 7;

  const nextStamp = anchorStamp + (weekDelta + 1) * 7;
  const daysUntilNext = Math.max(0, nextStamp - nowStamp);
  const daysInto = 7 - Math.min(7, daysUntilNext);
  const progress = Math.min(1, Math.max(0, daysInto / 7));

  const todayText = new Intl.DateTimeFormat("es-PE", {
    timeZone: tracker.timeZone,
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const nextText = new Intl.DateTimeFormat("es-PE", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(nextStamp * 86400000));

  return {
    weeks,
    daysIntoWeek,
    todayText,
    nextText,
    nextWeeks: weeks + 1,
    daysUntilNext,
    progress,
  };
}

function formatWeeksAndDays(weeks: number, days: number) {
  const sWeeks = weeks === 1 ? "semana" : "semanas";
  const sDays = days === 1 ? "día" : "días";
  return `${weeks} ${sWeeks} y ${days} ${sDays}`;
}

function findMonthSizeForWeek(week: number, monthSizes: PregnancyMonthSize[]) {
  const direct = monthSizes.find(
    (m) => week >= m.startWeek && week <= m.endWeek,
  );
  if (direct) return direct;

  const sorted = [...monthSizes].sort((a, b) => a.startWeek - b.startWeek);
  const below = [...sorted].reverse().find((m) => m.startWeek <= week);
  return below ?? sorted[0];
}

export default function BabySection({ items, tracker, monthSizes }: Props) {
  const trackerValue = useMemo(
    () =>
      tracker ?? {
        timeZone: "America/Lima",
        anchorDate: "2026-04-02",
        anchorWeeks: 11,
      },
    [tracker],
  );

  const monthSizesValue = useMemo<PregnancyMonthSize[]>(
    () =>
      monthSizes ?? [
        {
          month: 2,
          startWeek: 9,
          endWeek: 13,
          label: "Uva",
          img: "/frutas/uva.jpg",
        },
      ],
    [monthSizes],
  );

  const [weekState, setWeekState] = useState<WeekState>(() =>
    computeWeeks(new Date(), trackerValue),
  );

  useEffect(() => {
    const tick = () => setWeekState(computeWeeks(new Date(), trackerValue));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [trackerValue]);

  const monthSize = useMemo(
    () => findMonthSizeForWeek(weekState.weeks, monthSizesValue),
    [weekState.weeks, monthSizesValue],
  );

  const [fruitImgStatus, setFruitImgStatus] = useState<
    "loading" | "ok" | "error"
  >(monthSize.img ? "loading" : "error");

  useEffect(() => {
    setFruitImgStatus(monthSize.img ? "loading" : "error");
  }, [monthSize.img]);

  const weeksText = useMemo(
    () => formatWeeksAndDays(weekState.weeks, weekState.daysIntoWeek),
    [weekState.weeks, weekState.daysIntoWeek],
  );

  return (
    <section className="py-12 sm:py-14" id="bebe">
      <h2 className="text-xl font-semibold tracking-tight text-rose-950 sm:text-2xl">
        Nuestro bebé
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-rose-900/70 sm:text-base">
        Esta parte me emociona mucho, mi amor… también me da un poquito de
        miedo, pero sobre todo me llena de felicidad. Gracias por ser tan
        fuerte, mi vida. ❤️
      </p>

      <div className="mt-6 rounded-2xl bg-white/60 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-rose-950">Semanas</div>
            <div
              className="mt-2 text-2xl font-semibold tracking-tight text-rose-950 sm:text-3xl"
              aria-label={weeksText}
            >
              {weeksText}
            </div>
            <div className="mt-1 text-sm text-rose-900/65">
              Hoy: {weekState.todayText}
            </div>
          </div>

          <div className="shrink-0 rounded-2xl bg-white p-4 text-center shadow-sm">
            <div className="mx-auto grid h-24 w-24 place-items-center overflow-hidden rounded-2xl bg-white">
              {monthSize.img ? (
                <img
                  src={monthSize.img}
                  alt={`Fruta del mes ${monthSize.month}: ${monthSize.label}`}
                  onLoad={() => setFruitImgStatus("ok")}
                  onError={() => setFruitImgStatus("error")}
                  className="h-full w-full object-cover mix-blend-multiply saturate-110 contrast-105"
                  style={{
                    display: fruitImgStatus === "ok" ? "block" : "none",
                  }}
                />
              ) : null}
              {fruitImgStatus === "loading" ? (
                <div className="h-full w-full animate-pulse bg-rose-100/60" />
              ) : null}
              {fruitImgStatus === "error" ? (
                <div className="px-3 text-xs font-semibold text-rose-900/70">
                  {monthSize.label}
                </div>
              ) : null}
            </div>
            <div className="mt-3 text-sm font-semibold text-rose-950">
              Mes {monthSize.month}
            </div>
            <div className="text-sm text-rose-900/70">{monthSize.label}</div>
          </div>
        </div>

        <div
          className="mt-4 h-2.5 overflow-hidden rounded-full bg-rose-100/60"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-300 to-rose-500"
            style={{ width: `${weekState.progress * 100}%` }}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm font-semibold text-rose-900/70 sm:flex-row sm:items-center sm:justify-between">
          <div>
            Próximo cambio: {weekState.nextText} → {weekState.nextWeeks} semanas
          </div>
          <div>
            Faltan {weekState.daysUntilNext} día
            {weekState.daysUntilNext === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {items.map((it) => (
          <div className="border-l-2 border-rose-300/70 pl-4" key={it.id}>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700/70">
              {it.title.replace(/:$/, "")}
            </div>
            <div className="mt-2 text-sm leading-relaxed text-rose-900/70">
              {it.text}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
