import Image from "next/image";
import { FileText } from "lucide-react";
import { UpdateDetails } from "@/components/update-details";
import { Wrap } from "@/components/wrap";
import { updates } from "@/content/updates";

// Only the newest full email is expanded on load; the rest collapse behind their toggle.
const newestFullMessageId = updates.find((update) => update.sections)?.id;

export function Updates() {
  return (
    <section id="updates" className="py-16 sm:py-20">
      <Wrap>
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="mb-1.5 font-display text-xs uppercase tracking-[0.1em] text-rust">
              Team Updates
            </div>
            <h2 className="font-display text-2xl uppercase sm:text-[34px]">
              Latest Messages to Teams
            </h2>
          </div>
          <p className="text-[13px] font-semibold uppercase text-navy/50">Newest first</p>
        </div>

        <div className="flex flex-col gap-4">
          {updates.map((update) => (
            <article
              key={update.id}
              className="border-l-[6px] border-orange bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
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
                <span className="text-xs font-semibold uppercase text-navy/50">
                  {update.date}
                </span>
              </div>

              <h3 className="mb-2.5 font-display text-lg uppercase">{update.title}</h3>

              <p className="max-w-[70ch] text-sm leading-relaxed text-navy/75">
                {update.summary}
              </p>

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
                <div className="mt-4 grid max-w-3xl gap-4 sm:grid-cols-2">
                  {update.images.map((image) => (
                    <figure key={image.src}>
                      <div className="flex h-40 items-center justify-center border border-navy/10 bg-white p-3">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          width={image.width}
                          height={image.height}
                          sizes="(min-width: 640px) 360px, 100vw"
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

              {update.sections && (
                <UpdateDetails
                  id={update.id}
                  sections={update.sections}
                  defaultOpen={update.id === newestFullMessageId}
                />
              )}
            </article>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
