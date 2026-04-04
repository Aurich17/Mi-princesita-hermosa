type Props = {
  paragraphs: string[];
  signature: string;
};

export default function LetterSection({ paragraphs, signature }: Props) {
  return (
    <section className="py-12 sm:py-14" id="carta">
      <h2 className="text-xl font-semibold tracking-tight text-rose-950 sm:text-2xl">
        Carta
      </h2>
      <div className="mt-6 rounded-2xl bg-white/60 p-6 text-sm leading-relaxed text-rose-900/80 shadow-sm sm:p-7 sm:text-base">
        <div className="space-y-4">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p>
            <br />
            {signature}
          </p>
        </div>
      </div>
    </section>
  );
}
