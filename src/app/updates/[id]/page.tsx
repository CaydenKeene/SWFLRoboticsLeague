import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { UpdateCard } from "@/components/update-card";
import { Wrap } from "@/components/wrap";
import { site } from "@/content/site";
import { updatePath, updates } from "@/content/updates";

type Props = { params: Promise<{ id: string }> };

// Every email is known at build time; any other id is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return updates.map((update) => ({ id: update.id }));
}

function findUpdate(id: string) {
  return updates.find((update) => update.id === id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const update = findUpdate((await params).id);
  if (!update) return {};

  const title = update.emailNumber
    ? `League Email #${update.emailNumber}: ${update.title}`
    : update.title;

  // The summary doubles as the link-preview text when a coach shares the page.
  return {
    title: `${title} | ${site.name}`,
    description: update.summary,
    openGraph: {
      title,
      description: update.summary,
      url: updatePath(update),
      siteName: site.name,
      type: "article",
    },
  };
}

/** One league email on its own page, so it can be linked to and shared. */
export default async function UpdatePage({ params }: Props) {
  const update = findUpdate((await params).id);
  if (!update) notFound();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="py-16 sm:py-20">
          <Wrap>
            <Link
              href="/updates"
              className="mb-6 inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.08em] text-rust transition-opacity hover:opacity-70"
            >
              <ArrowLeft className="h-3.5 w-3.5 flex-none" aria-hidden />
              All Messages
            </Link>

            <UpdateCard update={update} detailsOpen="always" standalone />
          </Wrap>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
