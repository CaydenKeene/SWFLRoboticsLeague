import { Map } from "lucide-react";
import { Wrap } from "@/components/wrap";
import { schedule, scheduleNote, type ScheduleEvent } from "@/content/schedule";
import { site } from "@/content/site";

/** Column widths are shared by the header and every row so they stay aligned. */
const ROW_GRID = "sm:grid-cols-[130px_1fr_150px_190px]";

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

        {/* Hidden on mobile, where each row stacks into a single column. */}
        <div
          className={`hidden gap-1 px-5 pb-2 font-display text-[11px] uppercase tracking-[0.1em] text-white/40 sm:grid ${ROW_GRID}`}
        >
          <div>Date</div>
          <div>Event</div>
          <div>Location</div>
          <div>Map &amp; Info</div>
        </div>

        <div className="flex flex-col gap-0.5">
          {schedule.map((event, i) => (
            <div
              key={event.title}
              className={`grid items-center gap-1 px-5 py-4 ${ROW_GRID} ${
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
              <MapAndInfo event={event} />
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs text-white/40">{scheduleNote}</p>
      </Wrap>
    </section>
  );
}

/**
 * Venue map and note for one event. These land one venue at a time as the season
 * goes on, so a row with neither says when to expect them rather than sitting blank.
 */
function MapAndInfo({ event }: { event: ScheduleEvent }) {
  if (!event.mapUrl && !event.info) {
    return (
      <div className="text-[13px] font-bold uppercase tracking-[0.05em] text-white/40">
        Posted Closer to Event
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      {event.mapUrl && (
        <a
          href={event.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[13px] font-bold text-orange underline-offset-4 hover:underline"
        >
          <Map className="h-3.5 w-3.5 flex-none" aria-hidden />
          Venue Map (PDF)
        </a>
      )}
      {event.info && <p className="text-[13px] text-white/60">{event.info}</p>}
    </div>
  );
}
