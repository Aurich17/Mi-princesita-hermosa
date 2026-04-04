import type { TimelineItem } from "@/data/content";

type Props = {
  items: TimelineItem[];
};

export default function TimelineSection({ items }: Props) {
  return (
    <section className="py-12 sm:py-14" id="momentos">
      <h2 className="text-xl font-semibold tracking-tight text-rose-950 sm:text-2xl">
        Momentos
      </h2>

      <div className="relative mt-6">
        <div
          className="pointer-events-none absolute left-[19px] top-0 h-full w-px bg-rose-200/60"
          aria-hidden="true"
        />
        <div className="grid gap-4">
          {items.map((it) => (
            <div
              className="relative grid grid-cols-[40px_1fr] items-start gap-4 rounded-2xl bg-white/60 p-5 shadow-sm"
              key={it.id}
            >
              <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-100 text-sm font-semibold text-rose-800">
                {it.emoji}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-rose-950 sm:text-base">
                  {it.title}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-rose-900/70">
                  {it.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
