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
    id: "league-email-2",
    date: "August 2026",
    title: "20 Days to Kickoff",
    summary:
      "Only 20 days to go until the new season is unveiled! This is our 2nd league-wide email of the 2026–27 season. Please share it with all of your teams and parents.",
    sections: [
      {
        heading: "New League Website",
        body: "We have a new league website — the one you're reading right now. Please bookmark it. My plan is to post these emails here for easy reference and to keep the current schedule up to date. Once all the locations for each event are finalized, the events will also appear inside Region Manager, allowing teams to sign up for each one. That isn't important for the kickoff event, but after that it becomes important, as it filters which teams are event ready and which are not yet ready (more on that later).",
      },
      {
        heading: "Kick Off Event — We Will Have the New Game Elements!",
        body: "We WILL have a set of the current game elements at our Kick Off Event. This will be the first time for everyone to get an up-close view of the new game. Our kickoff will be held at Charlotte High School in Punta Gorda. Doors open at 10:00 am with a program start time of 10:30 am. We will have an opportunity for teams to give short presentations and then tune into the state kickoff broadcast for the national game reveal. Thanks to Bente Brauer for handling the game elements. Address: Charlotte Performing Arts Center, 701 Carmalita St., Punta Gorda, FL.",
      },
      {
        heading: "Call for Presentations",
        body: "Teams that wish to give a presentation at the kickoff event, please let me know by sending an email with your team member's topic and how much time you think they might need. I will select as many as I think will fit into our available time.",
      },
      {
        heading: "League Logo Contest",
        body: "With our new league, we need to have a new league logo. This was done successfully in the Gulf Coast FTC League a few years ago. I will make this announcement again at the kickoff.",
      },
      {
        heading: "Preliminary League Schedule",
        body: "Repeat from the first email — see the full schedule below: kickoff September 12th at Charlotte HS, scrimmage October 17th or 24th, Meet 1 November 14th, Meet 2 December 5th, Meet 3 January 9th or 16th, league judging interviews January 30th via Zoom, and the league championship February 13th.",
      },
      {
        heading: "Locations Still Needed",
        body: "The location of the league kickoff is very centrally located for all the teams. We are close to confirming locations for the October scrimmage and for December's Meet 2. We still need locations for November's Meet 1, January's Meet 3, and the February league championship. High school gyms are preferable, and schools with teams help keep the cost of the space to a minimum. If we have to use Facilitron or similar to reserve spaces, that usually comes with increased expenses to the league — hopefully we can keep that as a last resort. Please send any ideas you might have.",
      },
      {
        heading: "Volunteers Needed",
        body: "Repeat — Craig Price with the Redhot Chili Bots will be our Volunteer Coordinator for the season; he was very helpful this past season. We have been spoiled with the great crew from the Gulf Coast League (Bob, Jim, Dan, Steve, et al.) who put on the events, but we will need to build our own production crew. If you have any adults in your team's organization who you think would be a help, please send me their name. The big roles we need to fill: Referees, FTAs, and Scorers.",
      },
      {
        heading: "League Assets and Needs",
        body: "Coach David Silver (Jedison Knights) helped me last weekend pick up the items the Gulf Coast League gave us — two full fields and mats, some referee and volunteer shirts, wireless microphones, networking equipment, a pit display computer, scoring tablets, and more. We are very thankful to them for helping us get started, and I am personally thankful to Mr. Silver for providing a used enclosed trailer to help store and transport the league meeting equipment. As we gear up for the scrimmage, we will be working to make certain we can put on a full meet event.",
      },
      {
        heading: "League Sponsorship",
        body: "From a financial standpoint, we are starting with zero money to support the league and are looking for sponsors. This will help avoid any league fees during the season. Pass on any sponsor ideas you have. Donations can be made to SWFL Robotics, Inc., which is a nonprofit established to facilitate the league and its teams.",
      },
    ],
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
