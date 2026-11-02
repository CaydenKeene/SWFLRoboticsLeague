export type Sponsor = {
  /** Company name, used as the logo's alt text. */
  name: string;
  /**
   * Logo served from /public/sponsors, e.g. "/sponsors/acme.png". The banner is white,
   * so a white or transparent background blends in. Trim the margins around the
   * artwork and keep it around 240px tall; the banner sizes logos by their shape.
   */
  logo: string;
  /** The logo file's pixel size, so next/image can reserve its space. Only the ratio matters. */
  width: number;
  height: number;
  /** Sponsor's website. Omit and the logo isn't a link. */
  url?: string;
};

/**
 * Logos in the scrolling banner between the welcome section and the latest message,
 * in the order they scroll past. An empty list hides the banner.
 */
export const sponsors: Sponsor[] = [
  {
    name: "Keene Development, LLC",
    logo: "/sponsors/keene-development.png",
    width: 481,
    height: 240,
  },
  {
    name: "Charlotte High School",
    logo: "/sponsors/charlotte-high-school.png",
    width: 240,
    height: 240,
  },
  {
    name: "Gulf Coast Orthodontics",
    logo: "/sponsors/gulf-coast-orthodontics.png",
    width: 407,
    height: 240,
  },
  {
    name: "Nova Classical STEM Academy",
    logo: "/sponsors/nova-classical-stem-academy.png",
    width: 240,
    height: 240,
  },
  {
    name: "WISE Up Educational Services",
    logo: "/sponsors/wise-up-educational-services.png",
    width: 271,
    height: 240,
  },
  {
    name: "STEMania",
    logo: "/sponsors/stemania.png",
    width: 433,
    height: 115,
  },
];

export const sponsorsHeading = "Thank You to Our Sponsors";
