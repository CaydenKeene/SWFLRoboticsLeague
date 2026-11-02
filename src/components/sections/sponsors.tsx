import Image from "next/image";
import { sponsors, sponsorsHeading, type Sponsor } from "@/content/sponsors";

// Each half of the track holds at least this many logos, so a short sponsor list
// still spans a wide screen with no gap before it loops.
const MIN_LOGOS_PER_HALF = 10;
// Scroll speed: seconds for one logo to travel its own slot.
const SECONDS_PER_LOGO = 3;

/**
 * Sponsor logos scrolling left to right in an endless loop. The track holds the
 * logos twice and slides from -50% to 0, so the second half lands exactly where
 * the first began. Pauses on hover and stands still for reduced-motion users.
 */
export function Sponsors() {
  if (sponsors.length === 0) return null;

  const repeats = Math.ceil(MIN_LOGOS_PER_HALF / sponsors.length);
  const half = Array.from({ length: repeats }, () => sponsors).flat();

  return (
    <section aria-labelledby="sponsors-heading" className="border-b border-navy/10 bg-white pb-6 pt-2">
      <h2
        id="sponsors-heading"
        className="mb-3 text-center font-display text-xs uppercase tracking-[0.1em] text-rust"
      >
        {sponsorsHeading}
      </h2>

      <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div
          className="flex w-max animate-marquee-right group-hover:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ animationDuration: `${half.length * SECONDS_PER_LOGO}s` }}
        >
          {/* Screen readers and keyboard users get the logos once; the rest are visual repeats. */}
          {[half, half].flatMap((list, copy) =>
            list.map((sponsor, i) => (
              <SponsorLogo
                key={`${copy}-${i}`}
                sponsor={sponsor}
                hidden={copy > 0 || i >= sponsors.length}
              />
            )),
          )}
        </div>
      </div>
    </section>
  );
}

// Height of a square logo, in rem. Wider logos get shorter so a round seal and a
// long wordmark carry about the same visual weight.
const SQUARE_LOGO_HEIGHT = 5.25;

function SponsorLogo({ sponsor, hidden }: { sponsor: Sponsor; hidden: boolean }) {
  const aspect = sponsor.width / sponsor.height;
  const height = SQUARE_LOGO_HEIGHT / Math.pow(Math.max(aspect, 1), 0.45);

  const logo = (
    <Image
      src={sponsor.logo}
      alt={hidden ? "" : sponsor.name}
      width={sponsor.width}
      height={sponsor.height}
      sizes={`${Math.ceil(height * aspect * 16)}px`}
      style={{ height: `${height}rem` }}
      className="w-auto"
    />
  );

  return (
    <div className="flex shrink-0 items-center px-8 sm:px-10" aria-hidden={hidden || undefined}>
      {sponsor.url ? (
        <a
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={hidden ? -1 : undefined}
          className="transition-opacity hover:opacity-75"
        >
          {logo}
        </a>
      ) : (
        logo
      )}
    </div>
  );
}
