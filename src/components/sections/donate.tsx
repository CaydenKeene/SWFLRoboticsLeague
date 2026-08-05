import { Wrap } from "@/components/wrap";
import { site } from "@/content/site";

export function Donate() {
  // Until a real donation URL is set in src/content/site.ts, show a non-clickable
  // placeholder rather than a button that goes nowhere.
  const hasLink = site.donateUrl !== "#";

  return (
    <section id="donate" className="bg-teal py-14 sm:py-[70px]">
      <Wrap className="flex flex-wrap items-center justify-between gap-8">
        <div>
          <div className="mb-1.5 font-display text-xs uppercase tracking-[0.1em] text-cream">
            Support the League
          </div>
          <h2 className="mb-2 font-display text-2xl uppercase text-white sm:text-3xl">
            Help Us Grow SWFL Robotics
          </h2>
          <p className="max-w-[48ch] text-[15px] text-white/85">
            Donations from the community help cover field kits, venues, and awards for our
            teams. Every contribution helps a new team join FIRST Tech Challenge.
          </p>
        </div>

        {hasLink ? (
          <a
            href={site.donateUrl}
            className="clip-slant bg-orange px-8 py-4 pr-10 font-display text-sm uppercase text-navy transition-opacity hover:opacity-90 sm:text-[15px]"
          >
            Donate Now
          </a>
        ) : (
          <span className="clip-slant bg-white/20 px-8 py-4 pr-10 font-display text-sm uppercase text-white/70 sm:text-[15px]">
            Donation Link Coming Soon
          </span>
        )}
      </Wrap>
    </section>
  );
}
