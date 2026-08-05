import { Wrap } from "@/components/wrap";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="bg-navy py-7">
      <Wrap className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} {site.organization} — organizer of the {site.name}
        </p>
        <p className="text-xs text-white/50">A FIRST Tech Challenge league</p>
      </Wrap>
    </footer>
  );
}
