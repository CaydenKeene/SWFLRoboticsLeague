import { Wrap } from "@/components/wrap";
import { hero } from "@/content/site";

export function Hero() {
  return (
    <section id="welcome" className="relative overflow-hidden bg-navy pb-16 sm:pb-24">
      <div className="hero-stripes pointer-events-none absolute inset-0 opacity-90" aria-hidden />

      <Wrap className="relative grid items-end gap-10 pt-12 sm:pt-16 md:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="clip-slant mb-5 inline-flex items-center bg-orange px-4 py-1.5 pr-6 text-xs font-extrabold uppercase tracking-[0.08em] text-navy">
            {hero.badge}
          </div>

          <h1 className="mb-5 max-w-[13ch] font-display text-4xl uppercase leading-[1.02] text-white sm:text-5xl lg:text-[56px]">
            {hero.heading}
          </h1>

          {hero.paragraphs.map((text, i) => (
            <p
              key={i}
              className="mb-3 max-w-[54ch] text-base leading-relaxed text-white/75 last:mb-8 sm:text-lg"
            >
              {text}
            </p>
          ))}

          <div className="flex flex-wrap gap-4">
            <a
              href="#schedule"
              className="clip-slant bg-orange px-7 py-3.5 pr-9 font-display text-sm uppercase text-navy transition-opacity hover:opacity-90"
            >
              See the Schedule
            </a>
            <a
              href="#updates"
              className="border-2 border-white/40 px-7 py-3 font-display text-sm uppercase text-white transition-colors hover:border-white"
            >
              Latest Update
            </a>
          </div>
        </div>

        <div className="clip-notch bg-white p-7">
          <div className="mb-2 font-display text-[11px] uppercase tracking-[0.1em] text-rust">
            {hero.story.eyebrow}
          </div>
          <h2 className="mb-3 font-display text-xl uppercase">{hero.story.heading}</h2>
          <p className="text-sm italic leading-relaxed text-navy/60">{hero.story.body}</p>
        </div>
      </Wrap>
    </section>
  );
}
