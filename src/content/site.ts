export const site = {
  name: "SWFL Robotics League",
  organization: "SWFL Robotics, Inc.",
  season: "2026–2027 Season",
  email: "SWFLrobotic@gmail.com",
  // Swap in the real donation link when it exists; "#" renders the button as disabled.
  donateUrl: "#",
  description:
    "Home base for the SWFL Robotics FIRST Tech Challenge league — season updates, meet dates, and everything in between.",
} as const;

export const navItems = [
  { href: "#welcome", label: "Welcome" },
  { href: "#updates", label: "Updates" },
  { href: "#schedule", label: "Schedule" },
  { href: "#contact", label: "Contact" },
  { href: "#donate", label: "Donate" },
] as const;

export const hero = {
  badge: "New League · 2026–2027 Season",
  heading: "Welcome to the SWFL Robotics FTC League",
  paragraphs: [
    "We're a brand-new FIRST Tech Challenge league serving Southwest Florida, organized by SWFL Robotics, Inc. This page is home base for our teams — season updates, meet dates, and everything in between.",
    "Whether you're a coach, a student, or a parent, you're in the right place. Bookmark this page — we'll keep it current all season.",
  ],
  story: {
    eyebrow: "Our Story",
    heading: "How This League Started",
    body: "For the 2025/2026 season, Florida experienced the highest growth rate of all FIRST Tech Challenge regions. Our area was previously part of the Gulf Coast Robotics League, which had almost 50 registered teams last season. This incredible growth allows the SWFL area to now host its own league. This benefits teams by shortening travel to league events, and benefits the league by making it easier for new teams to join the FTC experience!",
  },
} as const;
