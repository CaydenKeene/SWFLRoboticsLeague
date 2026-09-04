import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Wrap } from "@/components/wrap";
import { donate } from "@/content/donate";
import { site } from "@/content/site";

const { thankYou } = donate;

export const metadata: Metadata = {
  title: `Thank You | ${site.name}`,
  description: "Your donation to SWFL Robotics, Inc. went through — thank you for supporting Southwest Florida's FIRST Tech Challenge teams.",
  // A landing spot for donors returning from Stripe, not a page to surface in
  // search results.
  robots: { index: false, follow: true },
};

/**
 * Where Stripe returns donors after a successful payment. The redirect itself is
 * set on the payment link in the Stripe dashboard, so this page has no idea what
 * was given — it confirms the gift landed and points back to the league.
 */
export default function ThankYou() {
  return (
    // The page is a single short section, so the column stretches to the
    // viewport and the navy fills whatever the content leaves over — otherwise
    // the footer floats with a band of cream beneath it.
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        <section className="relative flex flex-1 items-center overflow-hidden bg-navy py-16 sm:py-24">
          <div
            className="hero-stripes pointer-events-none absolute inset-0 opacity-90"
            aria-hidden
          />

          <Wrap className="relative">
            <div className="clip-slant mb-5 inline-flex items-center gap-2 bg-orange px-4 py-1.5 pr-6 text-xs font-extrabold uppercase tracking-[0.08em] text-navy">
              <Check className="h-4 w-4 flex-none" aria-hidden />
              {thankYou.eyebrow}
            </div>

            <h1 className="mb-5 max-w-[18ch] font-display text-4xl uppercase leading-[1.02] text-white sm:text-5xl lg:text-[56px]">
              {thankYou.heading}
            </h1>

            {thankYou.paragraphs.map((text, i) => (
              <p
                key={i}
                className="mb-3 max-w-[58ch] text-base leading-relaxed text-white/75 last:mb-8 sm:text-lg"
              >
                {text}
              </p>
            ))}

            <div className="flex flex-wrap gap-4">
              <Link
                href="/"
                className="clip-slant bg-orange px-7 py-3.5 pr-9 font-display text-sm uppercase text-navy transition-opacity hover:opacity-90"
              >
                {thankYou.homeLabel}
              </Link>
              <Link
                href="/#schedule"
                className="border-2 border-white/40 px-7 py-3 font-display text-sm uppercase text-white transition-colors hover:border-white"
              >
                {thankYou.scheduleLabel}
              </Link>
            </div>
          </Wrap>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
