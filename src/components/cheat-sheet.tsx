"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import {
  cheatSheet,
  rules,
  terms,
  type BulletGroup,
  type ManualRef,
  type PenaltyKey,
  type Rule,
  type RuleFilter,
  type TabId,
} from "@/content/cheat-sheet";
import { cn } from "@/lib/utils";

const { fouls, scoring, settings, iphoneToast } = cheatSheet;
const TAB_IDS = cheatSheet.tabs.map((t) => t.id);
const STORAGE_KEY = "bbmanual";

/**
 * Chip colors. Most are league tokens; the YELLOW and RED CARD chips keep true
 * yellow and red because they stand for the physical cards a referee holds up.
 */
const CHIP_STYLE: Record<PenaltyKey, string> = {
  VW: "bg-teal/15 text-navy",
  MIN: "bg-bone text-navy",
  MAJ: "bg-orange text-navy",
  YC: "bg-[#FFD60A] text-navy", // yellow card
  RC: "bg-[#B3261E] text-white", // red card
  DIS: "bg-navy text-white",
  DQ: "bg-navy text-white",
};

/* ------------------------------------------------------------------ helpers */

/** Renders **bold** spans in a content string. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/).map((part, i) =>
        i % 2 ? <b key={i}>{part}</b> : part,
      )}
    </>
  );
}

function Chip({ k }: { k: PenaltyKey }) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap border border-navy px-1 text-xs font-bold leading-4",
        CHIP_STYLE[k],
      )}
    >
      {cheatSheet.penalties[k]}
    </span>
  );
}

/** Renders a penalty string, turning `{VW}`-style tokens into chips. */
function PenaltyText({ text }: { text: string }) {
  return (
    <>
      {text.split(/\{(\w+)\}/).map((part, i) =>
        i % 2 ? <Chip key={i} k={part as PenaltyKey} /> : part,
      )}
    </>
  );
}

/** A rule's searchable summary: chips spelled out, lowercased. */
function plain(r: Rule) {
  return `${r.id} ${r.name} ${r.detail} ${r.pen} ${r.esc}`
    .replace(/\{(\w+)\}/g, (_, k: PenaltyKey) => cheatSheet.penalties[k])
    .toLowerCase();
}

function passes(r: Rule, f: RuleFilter) {
  if (f.warningOnly) return r.pen.includes("{VW}") && !r.esc;
  if (!f.penalties && !f.text) return true;
  const tokens = `${r.pen} ${r.esc}`;
  return (
    (f.penalties?.some((k) => tokens.includes(`{${k}}`)) ?? false) ||
    (f.text ? plain(r).includes(f.text) : false)
  );
}

/* --------------------------------------------------------------- page parts */

type ManualLink = (page: number) => {
  href: string;
  target: string;
  rel: string;
  onClick: () => void;
};

function Ref({ r, link }: { r: ManualRef; link: ManualLink }) {
  return (
    <a
      {...link(r.page)}
      className="my-0.5 mr-1 inline-flex min-h-8 items-center whitespace-nowrap border-[1.5px] border-rust px-2 text-xs font-bold text-rust"
    >
      {r.label}
    </a>
  );
}

function Refs({ refs, link }: { refs: ManualRef[]; link: ManualLink }) {
  return (
    <>
      {refs.map((r) => (
        <Ref key={r.label} r={r} link={link} />
      ))}
    </>
  );
}

const CARD_HEAD = { teal: "bg-teal", navy: "bg-navy", rust: "bg-rust" };

function Card({
  heading,
  tone = "teal",
  children,
}: {
  heading: string;
  tone?: keyof typeof CARD_HEAD;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2.5 overflow-hidden border-2 border-navy bg-white">
      <h2
        className={cn(
          "px-3 py-[5px] font-display text-[13px] uppercase tracking-[0.06em] text-white",
          CARD_HEAD[tone],
        )}
      >
        {heading}
      </h2>
      {children}
    </div>
  );
}

/** A label/note row. Zebra striping counts the card's children, as the original did. */
function Row({ label, note, children }: { label: string; note: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-b border-navy/15 px-3 py-[5px] even:bg-bone">
      <div className="min-w-0 flex-1">
        <b className="block text-sm leading-tight">{label}</b>
        <span className="block text-xs leading-tight text-navy/70">{note}</span>
      </div>
      {children}
    </div>
  );
}

const NUM = "min-w-10 text-center font-display text-[17px]";

function Pad({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-3 pb-2 pt-1.5 text-[13px]", className)}>{children}</div>;
}

function Groups({ groups }: { groups: BulletGroup[] }) {
  return (
    <>
      {groups.map((g) => (
        <div key={g.title}>
          <div className="mb-px mt-1.5 text-xs font-bold tracking-[0.05em] text-teal">
            {g.title}
          </div>
          <ul className={cn("m-0", g.numbered ? "list-none p-0" : "list-disc pl-[18px]")}>
            {g.bullets.map((b) => (
              <li key={b} className="my-0.5">
                <Rich text={b} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="px-1 pb-2.5 pt-0.5 text-xs text-navy/70">{children}</p>;
}

function ScoringTab({ link, goFouls }: { link: ManualLink; goFouls: () => void }) {
  const { matchPoints, clock, judging, penalties, rankingPoints, league } = scoring;
  return (
    <>
      <Card heading={matchPoints.heading}>
        <div className="flex gap-2 bg-navy px-3 py-[3px] text-xs font-bold tracking-[0.06em] text-white">
          <span className="flex-1">{matchPoints.columns[0]}</span>
          <i className="w-10 text-center not-italic">{matchPoints.columns[1]}</i>
          <i className="w-10 text-center not-italic">{matchPoints.columns[2]}</i>
        </div>
        {matchPoints.rows.map((r) => (
          <Row key={r.label} label={r.label} note={r.note}>
            <div className={NUM}>{r.auto}</div>
            <div className={NUM}>{r.teleop}</div>
          </Row>
        ))}
        <Pad>
          <Refs refs={matchPoints.refs} link={link} />
        </Pad>
      </Card>

      <Card heading={clock.heading} tone="navy">
        <Pad>
          <div className="flex gap-2">
            {clock.phases.map((p) => (
              <div key={p.label} className="flex-1 border border-navy px-2 py-[3px] text-xs">
                <b className="block font-display text-lg font-normal">{p.value}</b>
                {p.label}
              </div>
            ))}
          </div>
          <p className="mb-1 mt-2.5">
            <Rich text={clock.text} />
          </p>
          <Refs refs={clock.refs} link={link} />
        </Pad>
      </Card>

      <Card heading={judging.heading}>
        <Pad>
          <Groups groups={judging.groups} />
          <Refs refs={judging.refs} link={link} />
        </Pad>
      </Card>

      <Card heading={penalties.heading} tone="rust">
        <Pad>
          <div className="flex gap-2">
            {penalties.boxes.map((b) => (
              <div
                key={b.label}
                className={cn(
                  "flex-1 border border-navy px-2 py-[3px] text-xs",
                  b.tone === "minor" ? "bg-bone" : "bg-orange",
                )}
              >
                <b className="block font-display text-lg font-normal">{b.value}</b>
                {b.label}
              </div>
            ))}
          </div>
          <p className="mb-1 mt-2.5">{penalties.text}</p>
          <Refs refs={penalties.refs} link={link} />
          <a
            href="#fouls"
            onClick={(e) => {
              e.preventDefault();
              goFouls();
            }}
            className="my-0.5 inline-flex min-h-8 items-center whitespace-nowrap border-[1.5px] border-rust px-2 text-xs font-bold text-rust"
          >
            {penalties.foulsLink}
          </a>
        </Pad>
      </Card>

      <Card heading={rankingPoints.heading} tone="navy">
        {rankingPoints.rows.map((r) => (
          <Row key={r.label} label={r.label} note={r.note}>
            <span className="clip-slant whitespace-nowrap bg-orange py-0.5 pl-2.5 pr-3.5 font-display text-sm">
              {r.value}
            </span>
          </Row>
        ))}
        <Pad className="bg-bone">
          <Rich text={rankingPoints.note} />
          <br />
          <Refs refs={rankingPoints.refs} link={link} />
        </Pad>
      </Card>

      <Card heading={league.heading}>
        <Pad>
          <Groups groups={league.groups} />
          <Refs refs={league.refs} link={link} />
        </Pad>
      </Card>

      <Note>{scoring.source}</Note>
    </>
  );
}

/* ---------------------------------------------------------------- the page */

/**
 * The scorers' BIOBUZZ cheat sheet: fouls (searchable, filterable, each opening
 * its manual text), scoring, and terms. Built for a phone held at the field.
 * The open tab lives in the URL hash so a tab can be linked directly.
 */
export function CheatSheet() {
  const [tab, setTab] = useState<TabId>("fouls");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(0);
  const [openRule, setOpenRule] = useState<Rule | null>(null);
  const [base, setBase] = useState(cheatSheet.defaultManualUrl);
  const [draft, setDraft] = useState("");
  const [isIPhone, setIsIPhone] = useState(false);
  const [toastPage, setToastPage] = useState<number | null>(null);
  const [headerH, setHeaderH] = useState(100);

  const headerRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const show = useCallback((t: string) => {
    const next = (TAB_IDS as string[]).includes(t) ? (t as TabId) : "fouls";
    setTab(next);
    history.replaceState(null, "", `#${next}`);
    window.scrollTo(0, 0);
  }, []);

  // Open the tab named in the hash, and follow later hash changes.
  useEffect(() => {
    show(location.hash.slice(1));
    const onHash = () => show(location.hash.slice(1));
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, [show]);

  // The site's smooth scrolling and anchor offset are for the long home page;
  // here a tab switch should land at the top instantly.
  useEffect(() => {
    const html = document.documentElement.style;
    html.scrollBehavior = "auto";
    html.scrollPaddingTop = "0";
    return () => {
      html.scrollBehavior = "";
      html.scrollPaddingTop = "";
    };
  }, []);

  // Saved manual link and iPhone detection only exist in the browser.
  useEffect(() => {
    setIsIPhone(/iPhone|iPod/.test(navigator.userAgent));
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setBase(saved);
        setDraft(saved);
      }
    } catch {}
  }, []);

  // The search box sticks just under the header, whose height varies by phone.
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight - 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The toast hides itself after 15 seconds.
  useEffect(() => {
    if (toastPage === null) return;
    const t = setTimeout(() => setToastPage(null), 15000);
    return () => clearTimeout(t);
  }, [toastPage]);

  const link: ManualLink = (page) => ({
    href: `${base}#page=${page}`,
    target: "_blank",
    rel: "noopener",
    onClick: () => {
      if (isIPhone) setToastPage(page);
    },
  });

  function openSheet(r: Rule) {
    setOpenRule(r);
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  }

  function closeSheet() {
    dialogRef.current?.close();
  }

  function saveManual() {
    const v = draft.trim();
    if (!/^https?:\/\//.test(v)) return;
    const next = v.split("#")[0];
    setBase(next);
    setDraft(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }

  function resetManual() {
    setBase(cheatSheet.defaultManualUrl);
    setDraft("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  const q = query.trim().toLowerCase();
  const f = fouls.filters[filter];
  const list = rules.filter(
    (r) =>
      (!q || plain(r).includes(q) || r.text.toLowerCase().includes(q)) && passes(r, f),
  );

  // Inside the open sheet the toast must render in the dialog, or the modal
  // backdrop would cover it.
  const toast =
    toastPage === null ? null : (
      <div className="fixed bottom-[calc(8px+env(safe-area-inset-bottom))] left-2 right-2 z-50 flex items-center gap-2.5 bg-navy px-3 py-2.5 text-sm leading-snug text-white">
        <div className="flex-1">
          {iphoneToast.before}
          <b>
            {iphoneToast.goTo}
            {toastPage}
          </b>
          {iphoneToast.after}
        </div>
        <button
          type="button"
          onClick={() => setToastPage(null)}
          className="min-h-9 border-2 border-white px-2.5 text-[13px] font-bold"
        >
          {iphoneToast.dismiss}
        </button>
      </div>
    );

  return (
    <div className="min-h-dvh bg-cream pb-[env(safe-area-inset-bottom)] text-sm leading-[1.3] text-navy [-webkit-tap-highlight-color:transparent]">
      <header ref={headerRef} className="sticky top-0 z-[5] border-b-2 border-navy bg-orange">
        <div className="mx-auto flex max-w-[760px] items-center gap-2 px-3 pb-1 pt-1.5">
          <svg width="24" height="28" viewBox="0 0 44 50" aria-hidden className="flex-none">
            <polygon points="22,2 42,13.5 42,36.5 22,48 2,36.5 2,13.5" className="fill-navy" />
            <polygon points="22,11 34,18 34,32 22,39 10,32 10,18" className="fill-orange" />
          </svg>
          <h1 className="flex-1 whitespace-nowrap font-display text-base uppercase leading-tight tracking-[0.02em]">
            {cheatSheet.title}
          </h1>
          <small className="text-xs font-semibold">{cheatSheet.manualVersion}</small>
        </div>
        <nav role="tablist" className="mx-auto flex max-w-[760px] gap-[5px] px-2 pb-1.5">
          {cheatSheet.tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => show(t.id)}
              className="min-h-[34px] flex-1 border-2 border-navy bg-white px-1 py-[5px] text-[13px] font-bold text-navy aria-selected:bg-navy aria-selected:text-white"
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[760px] px-2 pb-7 pt-2">
        <section hidden={tab !== "scoring"}>
          <ScoringTab link={link} goFouls={() => show("fouls")} />
        </section>

        <section hidden={tab !== "fouls"}>
          <div className="mb-1.5 flex flex-wrap gap-x-2.5 gap-y-[3px] border-2 border-navy bg-white px-2.5 py-[5px] text-xs">
            {fouls.key.map((k) => (
              <span key={k} className="inline-flex items-center gap-[5px]">
                <PenaltyText text={k} />
              </span>
            ))}
          </div>

          <div className="sticky z-[4] bg-cream pb-1 pt-0.5" style={{ top: headerH }}>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={fouls.searchPlaceholder}
              autoComplete="off"
              aria-label="Search rules"
              // 16px keeps iOS from zooming in on focus.
              className="w-full border-2 border-navy bg-white px-2.5 py-1.5 text-base placeholder:text-navy/40 focus:border-orange focus:outline-none"
            />
            <div className="flex gap-[5px] overflow-x-auto pb-px pt-[5px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {fouls.filters.map((fl, i) => (
                <button
                  key={fl.label}
                  type="button"
                  aria-pressed={filter === i}
                  onClick={() => setFilter(i)}
                  className="min-h-8 flex-none border-2 border-navy bg-white px-2.5 text-xs font-bold text-navy aria-pressed:bg-navy aria-pressed:text-white"
                >
                  {fl.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            {list.length ? (
              list.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => openSheet(r)}
                  className="mb-1.5 block w-full border-2 border-navy bg-white px-2.5 py-1.5 text-left active:bg-bone"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-sm text-teal">{r.id}</span>
                    <span className="flex-1 text-sm font-bold leading-tight">
                      {r.name}
                      {r.detail && (
                        <em className="text-xs font-normal not-italic text-navy/70"> {r.detail}</em>
                      )}
                    </span>
                  </div>
                  <div className="mt-[3px] flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
                    <PenaltyText text={r.pen} />
                    {r.esc && (
                      <>
                        <span className="text-[11px] font-bold tracking-[0.05em] text-navy/70">→</span>
                        <span>
                          <PenaltyText text={r.esc} />
                        </span>
                      </>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-navy/70">{fouls.empty}</div>
            )}
          </div>

          <Note>
            <Rich text={fouls.footnote} />
          </Note>
        </section>

        <section hidden={tab !== "terms"}>
          {terms.map((t) => (
            <div key={t.name} className="mb-1.5 border-2 border-navy bg-white px-2.5 py-1.5">
              <b className="font-display text-sm font-normal tracking-[0.03em]">{t.name}</b>
              <p className="mb-1 mt-0.5 text-[13px] leading-[1.3]">{t.definition}</p>
              <Ref r={{ label: `${cheatSheet.terms.openLabel}${t.page}`, page: t.page }} link={link} />
            </div>
          ))}
          <Note>{cheatSheet.terms.footnote}</Note>
        </section>

        <div className="mt-3.5 text-xs text-navy/70">
          <details>
            <summary className="cursor-pointer py-1">
              <b>{settings.summary}</b>
            </summary>
            <p className="my-1">{settings.text}</p>
            <input
              type="url"
              inputMode="url"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={settings.placeholder}
              aria-label="Manual PDF link"
              className="mt-1 w-full border-2 border-navy bg-white p-2.5 text-base text-navy focus:border-orange focus:outline-none"
            />
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={saveManual}
                className="mt-1.5 min-h-10 border-2 border-navy bg-white px-3.5 text-[13px] font-bold text-navy"
              >
                {settings.save}
              </button>
              <button
                type="button"
                onClick={resetManual}
                className="mt-1.5 min-h-10 border-2 border-navy bg-white px-3.5 text-[13px] font-bold text-navy"
              >
                {settings.reset}
              </button>
            </div>
          </details>
        </div>
      </main>

      {/* The rule's bottom sheet. A native <dialog> gives Esc, focus trapping and
          the backdrop; a tap on the backdrop lands on the dialog itself. */}
      <dialog
        ref={dialogRef}
        onClose={() => {
          document.body.style.overflow = "";
          setOpenRule(null);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeSheet();
        }}
        className="fixed inset-x-0 bottom-0 top-auto m-0 mx-auto max-h-[86dvh] w-full max-w-[760px] flex-col border-2 border-b-0 border-navy bg-cream p-0 text-navy backdrop:bg-navy/50 open:flex"
      >
        {openRule && (
          <>
            <div className="flex items-center gap-2 border-b-2 border-navy bg-orange px-3 py-2">
              <b className="flex-1 font-display text-[15px] font-normal">
                {openRule.id} · {openRule.name}
              </b>
              <button
                type="button"
                onClick={closeSheet}
                aria-label={fouls.sheet.closeLabel}
                className="grid h-10 w-10 flex-none place-items-center border-2 border-navy bg-white"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="overflow-y-auto overscroll-contain px-3 pb-[calc(14px+env(safe-area-inset-bottom))] pt-2 text-sm">
              <div className="mt-[3px] flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
                <span className="text-[11px] font-bold tracking-[0.05em] text-navy/70">
                  {fouls.sheet.penaltyLabel}
                </span>
                <PenaltyText text={openRule.pen} />
              </div>
              {openRule.esc && (
                <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
                  <span className="text-[11px] font-bold tracking-[0.05em] text-navy/70">
                    {fouls.sheet.escalationLabel}
                  </span>
                  <span>
                    <PenaltyText text={openRule.esc} />
                  </span>
                </div>
              )}
              <div className="my-2 border-l-[5px] border-teal bg-white px-2.5 py-1.5 text-[13px] leading-[1.4]">
                {openRule.text}
              </div>
              <p className="my-1.5 text-xs text-navy/70">{fouls.sheet.sourceNote}</p>
              <a
                {...link(openRule.page)}
                className="mt-2.5 flex min-h-[42px] items-center justify-center gap-1.5 border-2 border-navy bg-navy text-sm font-bold text-white"
              >
                {fouls.sheet.openLabel}
                {openRule.page}
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </>
        )}
        {openRule && toast}
      </dialog>

      {!openRule && toast}
    </div>
  );
}
