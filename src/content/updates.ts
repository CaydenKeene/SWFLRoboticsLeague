export type UpdateSection = {
  heading: string;
  body: string;
};

export type Update = {
  id: string;
  /** Display date, e.g. "August 2026". */
  date: string;
  title: string;
  /** Optional status pill shown next to the date, e.g. "Coming Soon". */
  tag?: string;
  summary: string;
  /** Numbered detail blocks; omit for short announcements. */
  sections?: UpdateSection[];
};

/** Newest first — the Updates section renders these in array order. */
export const updates: Update[] = [
  {
    id: "logo-contest",
    date: "August 2026",
    title: "Team Logo Design Contest",
    tag: "Coming Soon",
    summary:
      "Coming soon — details on how your team can submit a design for the league logo.",
  },
  {
    id: "welcome-2026",
    date: "July 2026",
    title: "Welcome to the SWFL Robotics FTC League",
    summary:
      "Happy Summer everyone, and welcome to the SWFL Robotics FTC League! This is our first league-wide email of the 2026–27 season. Apologies in advance for its length…",
    sections: [
      {
        heading: "League Area",
        body: "This message goes to all the team coaches I know of for FTC teams in Manatee, Sarasota, Charlotte, Lee, and Collier Counties. All teams north of Manatee County remain in the Gulf Coast Robotics League.",
      },
      {
        heading: "Current Team Count",
        body: "I already know of some new additional teams that have either formed or are forming. If all teams in these counties return plus the new teams, our team count currently sits at 25 teams — a pretty good start for the new league.",
      },
      {
        heading: "Preliminary Schedule",
        body: "See the full schedule below — kickoff September 12th at Charlotte HS, scrimmage in October, meets in November, December and January, league judging interviews January 30th, and the league championship February 13th.",
      },
      {
        heading: "Kick Off Event",
        body: "Our kick off will be held at Charlotte High School in Punta Gorda. They have a nice auditorium facility on their campus which we are fortunate to use at no expense to the league (thanks Coach George!). We will have a new game set available for teams to see after the launch! More details to follow. Address: Charlotte Performing Arts Center, 701 Carmalita St., Punta Gorda, FL.",
      },
      {
        heading: "Locations Needed",
        body: "The kick-off location is very centrally located for all teams. We're working on locations for each event but they aren't confirmed yet — if you have ideas, please send them my way. Our best opportunities are usually at high schools with FTC teams, as we get use of them for free or nearly free.",
      },
      {
        heading: "Volunteers Needed",
        body: "Craig Price with the Redhot Chili Bots will be our Volunteer Coordinator for the season — he was very helpful this past season. We've been spoiled with the great crew from the Gulf Coast League (Bob, Jim, Dan, Steve, et al.) who put on the events, but will need to build our own production crew. If you have adults in your team's organization who could help, please send me their name. Big roles to fill: Referees, FTAs, Scorers.",
      },
      {
        heading: "League Assets and Needs",
        body: "We're very fortunate that the Gulf Coast League is gifting our new league field perimeters, mats, tablets, and some sound equipment. It's not everything we'll need, but it's a great start. As we inventory what we have, we'll let everyone know of additional assets needed. One big item will be game elements — we'll likely rely on the nearest teams to each event to bring theirs for the meets. Our plan is to run a two-field setup like this past season; the league will have one game set but will need more for the meets. The one big item we need to purchase is an enclosed trailer in decent shape to transport and store the bulk of the items used for each meet.",
      },
      {
        heading: "League Sponsorship",
        body: "From a financial standpoint, we're starting with zero money to support the league and are looking for sponsors — this will help avoid any league fees during the season. Pass on any sponsor ideas you have. Donations can be made to SWFL Robotics, Inc., the nonprofit established to facilitate the league and its teams.",
      },
    ],
  },
];
