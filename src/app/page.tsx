import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { Photos } from "@/components/sections/photos";
import { Updates } from "@/components/sections/updates";
import { Schedule } from "@/components/sections/schedule";
import { Contact } from "@/components/sections/contact";
import { Donate } from "@/components/sections/donate";

// The photos section shows the latest photo album, so the home page refreshes every
// 5 minutes like /photos does — a new album shows up here without a deploy.
export const revalidate = 300;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Photos />
        <Updates />
        <Schedule />
        <Contact />
        <Donate />
      </main>
      <SiteFooter />
    </>
  );
}
