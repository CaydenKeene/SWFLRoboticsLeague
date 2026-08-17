export type ScheduleEvent = {
  /** Short date label, e.g. "Sep 12" or "Oct 17 or 24". */
  date: string;
  title: string;
  /** Venue name, or null while the location is still being worked out. */
  location: string | null;
};

export const schedule: ScheduleEvent[] = [
  { date: "Sep 12", title: "Kickoff Event", location: "Charlotte HS" },
  { date: "Oct 17 or 24", title: "Scrimmage", location: null },
  { date: "Nov 14", title: "Meet 1", location: null },
  { date: "Dec 5", title: "Meet 2", location: null },
  { date: "Jan 9 or 16", title: "Meet 3", location: null },
  { date: "Jan 30", title: "League Judging Interviews", location: "Via Zoom" },
  { date: "Feb 13", title: "League Championship", location: null },
];

export const scheduleNote =
  "Dates and locations subject to change — updates will be posted above.";
