import type { StoryChapter } from "@/data/content";

type Props = {
  chapters: StoryChapter[];
};

export default function StorySection({ chapters }: Props) {
  return (
    <section
      className="py-12 sm:py-14"
      id="historia"
    >
      <h2 className="text-xl font-semibold tracking-tight text-rose-950 sm:text-2xl">
        Nuestra historia
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-rose-900/70 sm:text-base">
        No es perfecta, pero es nuestra… y eso es lo que la hace especial. ❤️
      </p>

      <div className="mt-6">
        <div
          className="overflow-hidden rounded-2xl border border-rose-200/60 bg-white/70"
          aria-label="Capítulos de nuestra historia"
        >
          {chapters.map((chapter) => (
            <details
              key={chapter.id}
              className="group border-b border-rose-200/60 last:border-b-0"
              open={chapter.defaultOpen}
            >
              <summary className="flex cursor-pointer list-none items-start gap-3 px-5 py-4 transition hover:bg-rose-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60 [&::-webkit-details-marker]:hidden">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-rose-950 sm:text-base">
                    {chapter.title}
                  </div>
                  {chapter.teaser ? (
                    <div className="mt-0.5 text-xs text-rose-900/60 sm:text-sm">
                      {chapter.teaser}
                    </div>
                  ) : null}
                </div>
                <div className="ml-auto mt-1 text-rose-400 transition group-open:rotate-180">▾</div>
              </summary>
              <div className="px-5 pb-6">
                {chapter.img ? (
                  <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <img
                      src={chapter.img}
                      alt={chapter.title}
                      className="w-full bg-white object-contain max-h-[520px]"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <div className="mt-4 whitespace-pre-line rounded-2xl border border-rose-200/60 bg-rose-50/60 px-4 py-3 text-sm leading-relaxed text-rose-900/75 sm:text-base">
                  {chapter.body}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
