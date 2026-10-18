export type UpdateSection = {
  heading: string;
  body: string;
  /**
   * Turns a phrase in `body` into a link, e.g. pointing "see the flyer" at a PDF in
   * public/docs. `text` must appear in `body` word for word; links open in a new tab.
   */
  link?: { text: string; href: string };
  /** A table shown under `body`, e.g. an event's schedule. Each row has one cell per column. */
  table?: { columns: string[]; rows: string[][] };
  /** A list shown under `body`, each item led by its bold `term`, e.g. volunteer roles. */
  list?: { term: string; text: string }[];
};

export type UpdateImage = {
  /** Image served from /public, e.g. "/league-logo.png". */
  src: string;
  alt: string;
  /** Intrinsic pixel size of the file, so the layout reserves the right box. */
  width: number;
  height: number;
  caption: string;
};

export type Update = {
  id: string;
  /** Display date — the day an email was sent, e.g. "August 23, 2026". */
  date: string;
  title: string;
  /** Optional status pill shown next to the date, e.g. "Coming Soon". */
  tag?: string;
  /** Position in the league email series; omit for announcements that aren't emails. */
  emailNumber?: number;
  summary: string;
  /**
   * Flyer PDF served from /public, e.g. "/docs/logo-contest-flyer.pdf".
   * Omit until the flyer exists — nothing renders in its place.
   */
  flyerUrl?: string;
  /**
   * Link text for the flyer, so it names what the reader is opening.
   * Defaults to `"<title> Flyer"`; set it where that reads awkwardly.
   */
  flyerLabel?: string;
  /** Images shown side by side under the summary; omit for text-only messages. */
  images?: UpdateImage[];
  /** Numbered detail blocks; omit for short announcements. */
  sections?: UpdateSection[];
};

/**
 * An email's own page, e.g. "/updates/league-email-6". The id is the URL slug, so
 * don't rename one once it's live — links people have shared would break.
 */
export function updatePath(update: Update) {
  return `/updates/${update.id}`;
}

/** Rendered in array order, newest first — a new league email goes at the top. */
export const updates: Update[] = [
  {
    id: "league-email-7",
    emailNumber: 7,
    date: "October 18, 2026",
    title: "Scrimmage Next Weekend: Everyone Is Welcome",
    summary:
      "Here is information for the scrimmage event next weekend, Saturday, October 24th at Nova Classical STEM Academy in Fort Myers. This email covers what to expect, the location and schedule, pit rules, competition manual updates, being competition ready, registering for meets, the official Q&A page, volunteers still needed, and the website. Please share it with your teams.",
    sections: [
      {
        heading: "What's Expected — Everyone Is Welcome!",
        body: "Our first activity after the season kickoff is a practice scrimmage and team build day. This is where everyone essentially practices to have a League Meet. All teams are invited even if you don't have a working robot completed yet. Just have a box of parts? You are still invited — there may actually be other teams that can help you out. This is also a practice for all the volunteers learning new roles. We will be setting up our scoring system for the first time, and I am certain there will be some bugs to work out. Attendance is not mandatory but is highly encouraged. Can only make it for part of the day? You are still welcome and encouraged.",
      },
      {
        heading: "Location",
        body: "The scrimmage will be at Nova Classical STEM Academy, 7101 Banway Rd., Fort Myers, FL 33907. You can access the site from either Gladiolus Drive or Summerlin Road. Enter through the front doors of the school — here is a map link.",
        link: { text: "here is a map link", href: "https://maps.app.goo.gl/p4WWuBJQRNdeJeXWA" },
      },
      {
        heading: "Scrimmage Schedule",
        body: "Here is the schedule for the day. This is not a perfect schedule and is subject to getting the scoring system set up and working, so be patient and feel free to help out and volunteer.",
        table: {
          columns: ["Time", "Activity"],
          rows: [
            ["7:30 AM", "Venue Access, Volunteer Check In, Load In Begins"],
            ["7:30 AM – 9:00 AM", "Field and Scoring System Set Up"],
            ["9:00 AM – 10:30 AM", "Scoring System Testing and Training"],
            ["10:30 AM – 11:30 AM", "Practice Robot Inspections / Inspector Training"],
            ["11:30 AM – 12:00 PM", "Practice Matches / Scorer Training / Referee Training"],
            ["12:00 PM – 1:00 PM", "Lunch Break"],
            ["1:00 PM – 3:30 PM", "Practice Matches / Scorer Training / Referee Training"],
            ["3:30 PM", "Begin Clean Up and Load Out"],
            ["4:30 PM", "Event Ends"],
          ],
        },
      },
      {
        heading: "Pit Rules",
        body: "The room we are using is a school cafeteria and essentially one large pit area. Typical FIRST policy is for eye protection and closed-toe shoes to be worn at all times in the pit areas. This means safety glasses and no sandals or Crocs-type shoes. For our rookies, you will need to purchase safety glasses for all of your team members. Food is OK, but please don't go crazy, to cut down on the garbage we will need to manage at the end of the day.",
      },
      {
        heading: "Competition Manual Updates",
        body: "The competition manual will continually get updates through the season. These updates are located under the Team Updates section of the season materials page. Team coaches can also sign up for the updates to be mailed to them directly as they happen. I find it very helpful to check this regularly — the changes and clarifications being made here help with understanding the rules and game play.",
        link: {
          text: "the season materials page",
          href: "https://ftc-resources.firstinspires.org/ftc/game",
        },
      },
      {
        heading: "Are You Competition Ready?",
        body: "Being competition ready means a team has completed its FIRST registration, has two mentors that have passed all their training and background checks, and has team members. Your team has to be competition ready in order to participate in the League Meets and League Tournament. You need to be competition ready several days before a meet, or the FIRST scoring system will not allow your team to be included in the event scoring. We only have 3–4 teams not yet ready, so I am sure that will get resolved soon.",
      },
      {
        heading: "Registering for Meets",
        body: "In Florida we use the FTC Region Manager. New coaches and mentors will need to create an account on Region Manager. It uses the same email that is attached to your FIRST account; it might use the same password, but it may also ask you to set up a separate one. Once you log in, select the team you manage and select the Events tab at the top. Select the event you want and you can register your team. Pretty straightforward once you get the hang of it. We are not requiring registration for the scrimmage, but we do for the rest of the events.",
        link: { text: "FTC Region Manager", href: "https://ftcregion.com" },
      },
      {
        heading: "FIRST Official Q&A Pages",
        body: "The official question and answer pages are where the official interpretations of the FTC game rules are published. Team coaches are able to post questions using their FIRST login credentials. Similar to the Team Updates above, this is a good resource to learn how the game works — many of the team updates you might see begin as questions posted to the Q&A pages.",
        link: {
          text: "official question and answer pages",
          href: "https://game-qa.firstinspires.org/",
        },
      },
      {
        heading: "Volunteers Still Needed",
        body: "Thanks to everyone that has volunteered so far, but we still need several important positions filled for the season:",
        list: [
          { term: "Referee", text: "We still need 2 more referees to run the matches. This is VERY important." },
          {
            term: "Assistant FTA (Field Technical Advisor)",
            text: "We still need another FTA to help run the fields during the matches.",
          },
          { term: "Scorekeeper", text: "This person helps set up the matches and posts the scores during the event." },
          {
            term: "Scorers",
            text: "We still need folks to be the scorers during the matches. We use scoring tablets, which keep this position relatively simple with little training.",
          },
          {
            term: "Emcee",
            text: "Looking for a couple of folks to be the emcees during the matches. A good emcee brings nice energy to events as the teams compete.",
          },
          {
            term: "Day-of Volunteers",
            text: "We always need the typical day-of volunteers, such as pit and practice field monitors and queuers who help the teams get to their assigned matches on time.",
          },
        ],
      },
      {
        heading: "Website Update",
        body: "Check out the SWFL Robotics website — the one you're reading right now. All the email messages I send, along with the past messages and event photos, are being posted here for easy access. If you have a team email address you wish to be included in this distribution list, please send it to me.",
      },
    ],
  },
  {
    id: "league-email-6",
    emailNumber: 6,
    date: "October 11, 2026",
    title: "So Close: Volunteers, Venues & Fees",
    summary:
      "So close… Our scrimmage is October 24th and the first official meet of the new league is November 14th. This email covers volunteers, the updated league schedule, league fees, and event logistics. Please share it with your parent group and team members.",
    flyerUrl: "/docs/sponsorship-flyer.pdf",
    flyerLabel: "League Fee Sponsorship Flyer",
    sections: [
      {
        heading: "Volunteers Needed",
        body: "As a very new league, with our scrimmage on October 24th and our first official meet on November 14th, we must assemble our event crew to produce the meets. We need parents and coaches to help us find folks to fill important roles. The most important roles to fill right now: referees (need 2 more), FTA (field technical advisor) and assistant (need at least 1 more), scorers (need 3–4 each meet), and official scorekeeper (need at least 1). We will also need the normal day-of roles such as robot inspectors, queuers, and field resetters. These are very good roles for involved parents to support their child by supporting the league. If you are interested, please contact Craig Price, our league volunteer coordinator.",
      },
      {
        heading: "League Schedule Update",
        body: "League Meet 1 — November 14th at Charlotte Performing Arts Center, Charlotte HS, 701 Carmalita St., Punta Gorda, FL (same location as the kickoff event). League Meet 2 — December 5th; we are still seeking a location, hopefully in the northern end of our league. League Meet 3 — January 16th at Fort Myers Senior High School, 2635 Cortez Blvd., Fort Myers, FL. League Tournament — February 13th at The Village School of Naples, 6000 Goodlette-Frank Rd., Naples, FL.",
      },
      {
        heading: "League Fees",
        body: "A reminder about the $100 per team league fee. We are challenging each team to seek out a company to sponsor their team by paying their league fee — see the sponsorship flyer.",
        link: { text: "see the sponsorship flyer", href: "/docs/sponsorship-flyer.pdf" },
      },
      {
        heading: "Event Logistics",
        body: "The success of our events depends on our teams and the many volunteers needed throughout the season. In addition to the volunteers above, we will need help at each event setting up and taking down the competition fields, spreading tarps on floors, and setting up and taking down tables and chairs. We typically have lots of kids (and parents) looking for things to do when they first arrive, so expect to pitch in for the good of all. And for parents and coaches wanting to play a larger role in the events, please encourage them to volunteer.",
      },
    ],
  },
  {
    id: "league-email-5",
    emailNumber: 5,
    date: "September 24, 2026",
    title: "And the Winning Logo Is…",
    summary:
      "After much deliberation amongst our highly trained selection committee, the league has a logo! The winning design comes from Team 32385 Mighty Mojo from Charlotte High School in Punta Gorda, with a VERY close second place finish by Team 30694 Bots4Life, a community-based team from Naples.",
    images: [
      {
        src: "/league-logo.png",
        alt: "SWFL Robotics League logo: a robotic arm over palm trees, a setting sun and ocean waves inside a gear, beside the words SWFL Robotics League, Programmed for the Challenge",
        width: 1647,
        height: 660,
        caption: "Winner — Team 32385 Mighty Mojo",
      },
      {
        src: "/logo-contest-second-place.png",
        alt: "Second place logo: a breaking wave with a gear and circuit traces above the words SWFL Robotics League",
        width: 1432,
        height: 955,
        caption: "Second place — Team 30694 Bots4Life",
      },
    ],
    sections: [
      {
        heading: "The Prize",
        body: "Since the prize for the contest was generously donated by Charlotte High School, Team 30694 Bots4Life will be receiving the goBILDA Starter Kit!",
      },
      {
        heading: "Thank You",
        body: "Thanks to everyone who submitted logo designs. In all, we had over 20 different designs submitted, and it was very difficult deciding from amongst the best. The participation in this was top notch. We look forward to an exciting season and seeing all the teams at the next league event.",
      },
    ],
  },
  {
    id: "league-email-4",
    emailNumber: 4,
    date: "September 16, 2026",
    title: "Kickoff Recap & Logo Contest Deadline",
    summary:
      "Great kickoff event! Thanks to the 15 or so teams that attended, and thanks again to Coach George and the Charlotte HS teams for making it possible — very nice facility. This is our 4th league-wide email of the 2026–27 season. Please share it with all of your teams and parents.",
    sections: [
      {
        heading: "League Logo Contest",
        body: "We have some nice submissions for the league logo contest — great job to everyone who has entered, and there is still time. The committee has decided to allow up to two submissions per team, so keep them coming. Email entries to swflrobotics@gmail.com by the end of Monday, September 21st. I will gather my elite team of highly trained and somewhat competent (hopefully unbiased) adults to help decide the future look of our league. I hope to have the result by the end of next week so the winning team gets the prize as soon as possible to help with their robot construction.",
      },
      {
        heading: "Current League Schedule",
        body: "September 12th — Kickoff Event at Charlotte HS. October 24th — Scrimmage at Nova Classical STEM Academy, 7101 Banway Rd., Fort Myers, FL 33907. November 14th — Meet 1, currently working on a location. December 5th — Meet 2, currently working on a location. January 9th or 16th — Meet 3, location still needed. January 30th — League Judging Interviews via Zoom. February 13th — League Championship, location TBD.",
      },
      {
        heading: "Locations Still Needed",
        body: "I believe we have the first three events solved — we just need to confirm some details with the venues for the first two meets, then I can let everyone know. Thanks to everyone who has been helping with locations, and please keep sending any ideas you might have. Ideally I would like an event in the Sarasota area and one in Collier County to balance things out. We do, however, need to lock these in as soon as possible.",
      },
      {
        heading: "Volunteer Roles Available",
        body: "Craig Price with the Redhot Chili Bots will be our Volunteer Coordinator for the season, as mentioned at the kickoff. We have been spoiled with the great crew from the Gulf Coast League (Bob, Jim, Dan, Steve, et al.) who put on the events, but we will need to build our own production crew. If you have any adults in your team's organization who you think would be a help, please send me their name. The big roles we need to fill: referees, FTAs, scorers (important), official scorekeeper, setup and takedown crew, team queuers, robot inspectors, and the registration table. I would like to line most of these up by our scrimmage so we can practice scoring some matches. There is lots of training available through the FIRST system, so it is actually pretty easy to be a volunteer — see the FIRST volunteer resources at ftc-resources.firstinspires.org/ftc/volunteer.",
      },
      {
        heading: "League Assets and Needs",
        body: "Coach David Silver (Jedison Knights) and I will be working over the next few weeks to double-check that we have everything we need to run an event. We are close — we may need a laptop or two and some scoring tablets. As we gear up for the scrimmage, we will be working to make certain we can put on a full meet event.",
      },
      {
        heading: "League Fee Sponsorship",
        body: "A flyer outlining the league fee sponsorship went out with this email — apologies, I thought I had emailed it out to everyone previously. It should have all the information you need, but please send any questions you have.",
      },
    ],
  },
  {
    id: "league-email-3",
    emailNumber: 3,
    date: "September 8, 2026",
    title: "Call for Presentations at Kickoff",
    summary:
      "Kickoff is this Saturday. We would like to see presentations from FTC team members on any topic related to FTC — CAD, outreach, team leadership and organization, fundraising, and more. A couple of ideas have already come in, and this is a great chance for a team member to practice their outreach. Please pass the kickoff and logo contest flyers on to your team members and parents.",
    sections: [
      {
        heading: "How to Submit a Presentation",
        body: "Email your team member's idea to the league address, swflrobotics@gmail.com. Presentations should run no longer than about 7 minutes, though the final length will depend on how many submissions we receive. Slides can be PowerPoint or PDF, or the presentation can be a YouTube video. Send it ahead of time or bring it on a flash drive.",
      },
      {
        heading: "League Logo Contest",
        body: "We have already received our first submission for the league logo contest! Entries are open to any registered SWFL Robotics team — see the contest flyer for the rules, file requirements, and where to send an entry.",
      },
    ],
  },
  {
    id: "league-email-2",
    emailNumber: 2,
    date: "August 23, 2026",
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
    emailNumber: 1,
    date: "July 30, 2026",
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
