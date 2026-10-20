import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { ShareLinkButton } from "@/components/share-link-button";
import { UpdateDetails } from "@/components/update-details";
import { site } from "@/content/site";
import { updatePath, type Update } from "@/content/updates";
import { cn } from "@/lib/utils";

/**
 * One league email. Shared by the home page, the /updates archive, and each
 * email's own page, so a message looks the same wherever it's read.
 */
export function UpdateCard({
  update,
  detailsOpen = "closed",
  standalone = false,
  compact = false,
  className,
}: {
  update: Update;
  /** "desktop" opens the numbered sections on wide screens only; "always" opens them everywhere. */
  detailsOpen?: "closed" | "desktop" | "always";
  /** True on the email's own page: the title is the page's h1 and doesn't link to itself. */
  standalone?: boolean;
  /**
   * Summary only: the numbered sections are replaced by a link to the email's own
   * page, where they're open. Keeps the home page card a fixed, short height.
   */
  compact?: boolean;
  className?: string;
}) {
  const path = updatePath(update);
  const Heading = standalone ? "h1" : "h3";
  const shareTitle = update.emailNumber
    ? `League Email #${update.emailNumber}: ${update.title}`
    : update.title;

  return (
    <article
      className={cn(
        "border-l-[6px] border-orange bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
        {update.tag && (
          <span className="border border-teal px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-teal">
            {update.tag}
          </span>
        )}
        {update.emailNumber && (
          <span className="font-display text-lg uppercase text-rust">
            League Email #{update.emailNumber}
          </span>
        )}
        <span className="text-xs font-semibold uppercase text-navy/50">{update.date}</span>
        <div className="ml-auto">
          <ShareLinkButton path={path} title={`${shareTitle} | ${site.name}`} />
        </div>
      </div>

      <Heading className="mb-2.5 font-display text-lg uppercase">
        {standalone ? (
          update.title
        ) : (
          <Link
            href={path}
            className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-orange"
          >
            {update.title}
          </Link>
        )}
      </Heading>

      <p className="max-w-[70ch] text-sm leading-relaxed text-navy/75">{update.summary}</p>

      {update.flyerUrl && (
        <a
          href={update.flyerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3.5 inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.08em] text-rust underline decoration-rust/30 underline-offset-4 transition-colors hover:decoration-rust"
        >
          <FileText className="h-3.5 w-3.5 flex-none" aria-hidden />
          {update.flyerLabel ?? `${update.title} Flyer`} (PDF)
        </a>
      )}

      {update.images && (
        <div className="mt-4 grid max-w-md gap-3 sm:grid-cols-2">
          {update.images.map((image) => (
            <figure key={image.src}>
              <div className="flex h-20 items-center justify-center border border-navy/10 bg-white p-3">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 640px) 200px, 100vw"
                  className="max-h-full w-auto object-contain"
                />
              </div>
              <figcaption className="mt-1.5 text-xs font-semibold uppercase text-navy/60">
                {image.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {update.sections && compact && (
        <Link
          href={path}
          className="mt-3.5 flex w-fit items-center gap-1.5 font-display text-xs uppercase tracking-[0.08em] text-rust transition-opacity hover:opacity-70"
        >
          Read Full Message
          <ArrowRight className="h-3.5 w-3.5 flex-none" aria-hidden />
        </Link>
      )}

      {update.sections && !compact && (
        <UpdateDetails
          id={update.id}
          sections={update.sections}
          defaultOpen={detailsOpen === "desktop"}
          openOnLoad={detailsOpen === "always"}
        />
      )}
    </article>
  );
}
