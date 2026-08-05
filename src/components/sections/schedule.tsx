import { Wrap } from "@/components/wrap";
import { schedule, scheduleNote } from "@/content/schedule";
import { site } from "@/content/site";

export function Schedule() {
  return (
    <section id="schedule" className="bg-navy py-16 sm:py-20">
      <Wrap>
        <div className="mb-1.5 font-display text-xs uppercase tracking-[0.1em] text-orange">
          {site.season}
        </div>
        <h2 className="mb-9 font-display text-2xl uppercase text-white sm:text-[34px]">
          Schedule
        </h2>

        <div className="flex flex-col gap-0.5">
          {schedule.map((event, i) => (
            <div
              key={event.title}
              className={`grid items-center gap-1 px-5 py-4 sm:grid-cols-[160px_1fr_160px] ${
                i % 2 === 0 ? "bg-white/[0.06]" : ""
              }`}
            >
              <div className="font-display text-sm uppercase text-orange">{event.date}</div>
              <div className="font-bold text-white sm:text-base">{event.title}</div>
              {event.location ? (
                <div className="text-[13px] text-white/60">{event.location}</div>
              ) : (
                <div className="text-[13px] font-bold uppercase tracking-[0.05em] text-white/40">
                  TBD
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs text-white/40">{scheduleNote}</p>
      </Wrap>
    </section>
  );
}
