import type { Metadata } from "next";
import { CheatSheet } from "@/components/cheat-sheet";
import { cheatSheet } from "@/content/cheat-sheet";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${cheatSheet.title} | ${site.name}`,
  description: "Fouls, scoring and terms for BIOBUZZ scorers at league events.",
  // A tool for scorers, reached only by its shared URL — nothing on the site
  // links here, and it stays out of search results.
  robots: { index: false, follow: false },
};

/**
 * The scorers' cheat sheet. No site header or footer: on a phone at the field
 * the tool's own sticky tabs are all the chrome it should have.
 */
export default function CheatSheetPage() {
  return <CheatSheet />;
}
