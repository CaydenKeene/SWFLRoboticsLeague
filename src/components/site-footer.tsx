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
        {site.credit && (
          <p className="text-xs text-white/50">
            {site.credit.prefix}{" "}
            <a
              href={site.credit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/75 underline decoration-white/25 underline-offset-4 transition-colors hover:text-orange hover:decoration-orange"
            >
              {site.credit.name}
            </a>
          </p>
        )}
      </Wrap>
    </footer>
  );
}
