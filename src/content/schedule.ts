export type ScheduleEvent = {
  /** Short date label, e.g. "Sep 12" or "Oct 17 or 24". */
  date: string;
  title: string;
  /** Venue name, or null while the location is still being worked out. */
  location: string | null;
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
};

export const schedule: ScheduleEvent[] = [
  {
    date: "Sep 12",
    title: "Kickoff Event",
    location: "Charlotte HS",
    flyerUrl: "/docs/kickoff-flyer.pdf",
    flyerLabel: "Kickoff Flyer",
  },
  { date: "Oct 17 or 24", title: "Scrimmage", location: null },
  { date: "Nov 14", title: "Meet 1", location: null },
  { date: "Dec 5", title: "Meet 2", location: null },
  { date: "Jan 9 or 16", title: "Meet 3", location: null },
  { date: "Jan 30", title: "League Judging Interviews", location: "Via Zoom" },
  { date: "Feb 13", title: "League Championship", location: null },
];

export const scheduleNote =
  "Dates and locations subject to change — updates will be posted above.";
