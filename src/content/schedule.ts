export type ScheduleEvent = {
  /** Short date label, e.g. "Sep 12" or "Oct 17 or 24". */
  date: string;
  title: string;
  /** Venue name, or null while the location is still being worked out. */
  location: string | null;
  /**
   * Street address, shown under the venue name. Omit for venues that don't have
   * one yet and for events that aren't held anywhere physical.
   */
  address?: string;
  /**
   * Event flyer PDF served from /public, e.g. "/docs/kickoff-flyer.pdf".
   * Omit until there's a flyer for the event.
   */
  flyerUrl?: string;
  /**
   * Link text for the flyer, so each event's link names that event once several
   * are listed. Defaults to `"<title> Flyer"`; set it where that reads awkwardly.
   */
  flyerLabel?: string;
  /**
   * Venue map PDF served from /public, e.g. "/docs/charlotte-hs-map.pdf".
   * Omit until the venue sends one — a row with nothing at all renders TBD.
   */
  mapUrl?: string;
  /** One-line venue note: parking, entrance, pit access. Omit when there's nothing to say. */
  info?: string;
  /**
   * The event's photo album slug, e.g. "2026-09-12-kickoff-event" for the photo-store
   * folder "2026-09-12 Kickoff Event". Set it once photos are up; the row then links
   * to /photos/<id>. /add-photos fills it in.
   */
  albumId?: string;
};

export const schedule: ScheduleEvent[] = [
  {
    date: "Sep 12",
    title: "Kickoff Event",
    location: "Charlotte Performing Arts Center",
    address: "701 Carmalita St, Punta Gorda, FL 33950",
    flyerUrl: "/docs/kickoff-flyer.pdf",
    flyerLabel: "Kickoff Flyer",
    albumId: "2026-09-12-kickoff-event",
  },
  {
    date: "Oct 24",
    title: "Scrimmage",
    location: "Nova Classical STEM Academy",
    address: "7101 Banway Rd, Fort Myers, FL 33907",
    info: "Access from Gladiolus Dr or Summerlin Rd; enter through the school's front doors.",
  },
  {
    date: "Nov 14",
    title: "Meet 1",
    location: "Charlotte Performing Arts Center",
    address: "701 Carmalita St, Punta Gorda, FL 33950",
  },
  { date: "Dec 5", title: "Meet 2", location: null },
  {
    date: "Jan 16",
    title: "Meet 3",
    location: "Fort Myers Senior High School",
    address: "2635 Cortez Blvd, Fort Myers, FL 33901",
  },
  { date: "Jan 30", title: "League Judging Interviews", location: "Via Zoom" },
  {
    date: "Feb 13",
    title: "League Tournament",
    location: "Village School of Naples",
    address: "6000 Goodlette-Frank Rd N, Naples, FL 34109",
  },
];

export const scheduleNote =
  "Dates and locations subject to change — updates will be posted above.";
