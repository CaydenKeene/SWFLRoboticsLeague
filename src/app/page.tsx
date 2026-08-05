import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { Updates } from "@/components/sections/updates";
import { Schedule } from "@/components/sections/schedule";
import { Contact } from "@/components/sections/contact";
import { Donate } from "@/components/sections/donate";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Updates />
        <Schedule />
        <Contact />
        <Donate />
      </main>
      <SiteFooter />
    </>
  );
}
