import { DonateDialog } from "@/components/donate-dialog";
import { Wrap } from "@/components/wrap";

export function Donate() {
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

        <DonateDialog />
      </Wrap>
    </section>
  );
}
