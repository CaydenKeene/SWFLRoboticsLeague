import { CopyEmailButton } from "@/components/copy-email-button";
import { Wrap } from "@/components/wrap";

export function Contact() {
  return (
    <section id="contact" className="bg-cream py-14 sm:py-[70px]">
      <Wrap className="flex flex-wrap items-center justify-between gap-8">
        <div>
          <div className="mb-1.5 font-display text-xs uppercase tracking-[0.1em] text-rust">
            Get in Touch
          </div>
          <h2 className="mb-2 font-display text-2xl uppercase sm:text-3xl">
            Questions About the League?
          </h2>
          <p className="max-w-[48ch] text-[15px] text-navy/70">
            Reach the SWFL Robotics League organizers directly — we're happy to help.
          </p>
        </div>

        <CopyEmailButton />
      </Wrap>
    </section>
  );
}
