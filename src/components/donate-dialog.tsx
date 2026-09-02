"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Copy, CreditCard, Mail, X } from "lucide-react";
import { donate } from "@/content/donate";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type Step = "choose" | "form" | "sent";
type Status = "idle" | "sending" | "failed";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/** Field names double as the labels in the email the league receives. */
const AMOUNT = "Amount";
const DESIGNATION = "Going to";
const ADDRESS = "Mailing address";
const NOTES = "Notes";

const INPUT =
  "w-full border border-navy/20 bg-white px-3 py-2.5 text-sm text-navy placeholder:text-navy/35 focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange";

/**
 * The Donate button and its popup: give through Stripe, or tell us a check is on
 * the way and get the mailing address.
 *
 * A native <dialog> carries the modal behavior — Esc to close, focus trapped
 * inside, the page behind inert, a styleable ::backdrop — so none of that is
 * hand-rolled here.
 */
export function DonateDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<Step>("choose");
  const [status, setStatus] = useState<Status>("idle");
  const [donorName, setDonorName] = useState("");
  const [memo, setMemo] = useState("");

  const hasStripe = site.donateUrl !== "#";
  // Without a Web3Forms key there is nowhere to deliver the form, so the check
  // path goes straight to the address rather than collecting details in vain.
  const canCollect = donate.web3formsKey !== "";

  function open() {
    setStep("choose");
    setStatus("idle");
    setDonorName("");
    setMemo("");
    ref.current?.showModal();
    document.body.style.overflow = "hidden";
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const fields = new FormData(event.currentTarget);
    // An untouched Notes box would otherwise arrive as an empty row in the email.
    if (!String(fields.get(NOTES) ?? "").trim()) fields.delete(NOTES);
    fields.set("access_key", donate.web3formsKey);
    fields.set("from_name", site.name);
    fields.set("subject", `Check donation coming — ${fields.get("name")}`);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, { method: "POST", body: fields });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      setDonorName(String(fields.get("name") ?? ""));
      setMemo(String(fields.get(DESIGNATION) ?? ""));
      setStep("sent");
    } catch {
      // The address is the whole point of the form — the failure notice shows it
      // anyway rather than letting a network error cost the league a donation.
      setStatus("failed");
    }
  }

  const title =
    step === "choose"
      ? "Support the League"
      : step === "form"
        ? "Mail a Check"
        : donate.sent.heading;

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="clip-slant bg-orange px-8 py-4 pr-10 font-display text-sm uppercase text-navy transition-opacity hover:opacity-90 sm:text-[15px]"
      >
        Donate Now
      </button>

      <dialog
        ref={ref}
        onClose={() => {
          document.body.style.overflow = "";
        }}
        onClick={(event) => {
          // A click on the ::backdrop is reported against the dialog itself;
          // anything inside the panel targets a descendant.
          if (event.target === ref.current) ref.current?.close();
        }}
        className="max-h-[calc(100dvh-3rem)] w-[min(34rem,calc(100vw-1.5rem))] overflow-y-auto bg-white p-0 text-navy shadow-[0_10px_40px_rgba(0,0,0,0.3)] backdrop:bg-navy/70"
      >
        <div className="flex items-center gap-3 bg-navy px-5 py-3.5 sm:px-6">
          {step === "form" && (
            <button
              type="button"
              onClick={() => {
                setStep("choose");
                setStatus("idle");
              }}
              aria-label="Back to donation options"
              className="-ml-1.5 flex-none p-1.5 text-white/70 transition-colors hover:text-orange"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h2 className="font-display text-base uppercase text-white sm:text-lg">{title}</h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="-mr-1.5 ml-auto flex-none p-1.5 text-white/70 transition-colors hover:text-orange"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-6 sm:px-6">
          {step === "choose" && (
            <>
              <p className="mb-5 text-sm leading-relaxed text-navy/75">{donate.intro}</p>

              <div className="flex flex-col gap-3">
                {hasStripe && (
                  <a
                    href={site.donateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-3.5 border border-navy/15 p-4 transition-colors hover:border-orange hover:bg-cream/60"
                  >
                    <CreditCard
                      className="mt-0.5 h-5 w-5 flex-none text-rust transition-colors group-hover:text-orange"
                      aria-hidden
                    />
                    <span>
                      <span className="block font-display text-sm uppercase">
                        {donate.stripe.label}
                      </span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-navy/70">
                        {donate.stripe.blurb}
                      </span>
                      <span className="mt-1.5 block text-xs text-navy/50">
                        {donate.stripe.feeNote}
                      </span>
                    </span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setStep(canCollect ? "form" : "sent")}
                  className="group flex gap-3.5 border border-navy/15 p-4 text-left transition-colors hover:border-orange hover:bg-cream/60"
                >
                  <Mail
                    className="mt-0.5 h-5 w-5 flex-none text-rust transition-colors group-hover:text-orange"
                    aria-hidden
                  />
                  <span>
                    <span className="block font-display text-sm uppercase">
                      {donate.check.label}
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-navy/70">
                      {donate.check.blurb}
                    </span>
                  </span>
                </button>
              </div>
            </>
          )}

          {step === "form" && (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <p className="text-sm leading-relaxed text-navy/75">{donate.form.intro}</p>

              <Field label="Amount you plan to give" htmlFor="donate-amount">
                <div className="relative">
                  <span
                    className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-navy/50"
                    aria-hidden
                  >
                    $
                  </span>
                  <input
                    id="donate-amount"
                    name={AMOUNT}
                    type="number"
                    inputMode="decimal"
                    min="1"
                    step="0.01"
                    required
                    autoFocus
                    placeholder="An estimate is fine"
                    className={cn(INPUT, "pl-7")}
                  />
                </div>
              </Field>

              <Field label="Going to" htmlFor="donate-designation">
                <input
                  id="donate-designation"
                  name={DESIGNATION}
                  list="donate-designations"
                  required
                  placeholder="Choose one, or type a team"
                  className={INPUT}
                />
                <datalist id="donate-designations">
                  {donate.form.designations.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </Field>

              <Field label="Your name" htmlFor="donate-name">
                <input id="donate-name" name="name" type="text" required className={INPUT} />
              </Field>

              <Field label="Email" htmlFor="donate-email">
                <input id="donate-email" name="email" type="email" required className={INPUT} />
              </Field>

              <Field label="Your mailing address" htmlFor="donate-address">
                <textarea
                  id="donate-address"
                  name={ADDRESS}
                  rows={3}
                  required
                  placeholder="Street, city, state, ZIP — for your acknowledgment letter"
                  className={INPUT}
                />
              </Field>

              <Field label="Notes" htmlFor="donate-notes" optional>
                <textarea id="donate-notes" name={NOTES} rows={2} className={INPUT} />
              </Field>

              {/* Web3Forms' honeypot: a real person never checks a hidden box. */}
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hidden"
              />

              {status === "failed" && (
                <p className="border-l-[3px] border-rust bg-cream px-3.5 py-3 text-[13px] leading-relaxed text-navy/80">
                  That didn&apos;t send — but nothing is lost. Mail your check to{" "}
                  <strong className="font-semibold">{donate.payableTo}</strong>,{" "}
                  {donate.mailingAddress.join(", ")}, or email us at {site.email}.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="clip-slant mt-1 self-start bg-orange px-7 py-3.5 pr-9 font-display text-sm uppercase text-navy transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : donate.form.submitLabel}
              </button>

              <span aria-live="polite" className="sr-only">
                {status === "sending" && "Sending your details"}
                {status === "failed" &&
                  `Couldn't send. Mail your check to ${donate.payableTo}, ${donate.mailingAddress.join(", ")}`}
              </span>
            </form>
          )}

          {step === "sent" && (
            <>
              <p className="text-sm leading-relaxed text-navy/75">
                {donorName ? `Thanks, ${donorName} — we'll watch for it.` : donate.sent.thanks}{" "}
                Make your check payable to{" "}
                <strong className="font-semibold text-navy">{donate.payableTo}</strong> and mail
                it to:
              </p>

              <address className="mt-4 border-l-[6px] border-orange bg-cream px-4 py-3.5 not-italic">
                <span className="block font-display text-sm uppercase">{donate.payableTo}</span>
                {donate.mailingAddress.map((line) => (
                  <span key={line} className="mt-0.5 block text-sm text-navy/80">
                    {line}
                  </span>
                ))}
              </address>

              <CopyAddressButton />

              {memo && (
                <p className="mt-4 text-[13px] leading-relaxed text-navy/70">
                  On the memo line, write <strong className="font-semibold">{memo}</strong> so we
                  can credit it correctly.
                </p>
              )}

              <p className="mt-4 text-[13px] leading-relaxed text-navy/60">
                {donate.sent.acknowledgment}
              </p>

              <button
                type="button"
                onClick={() => ref.current?.close()}
                className="clip-slant mt-5 bg-orange px-7 py-3.5 pr-9 font-display text-sm uppercase text-navy transition-opacity hover:opacity-90"
              >
                Done
              </button>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}

function Field({
  label,
  htmlFor,
  optional = false,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block font-display text-xs uppercase tracking-[0.08em] text-navy/70"
      >
        {label}
        {optional && (
          <span className="ml-1.5 normal-case tracking-normal text-navy/40">(optional)</span>
        )}
      </label>
      {children}
    </div>
  );
}

/** How long the confirmation stays up before the button returns to its resting label. */
const RESET_MS = 10_000;

function CopyAddressButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(
        [donate.payableTo, ...donate.mailingAddress].join("\n"),
      );
    } catch {
      // Clipboard access is blocked in some browsers and insecure contexts. The
      // address is printed directly above, so there is nothing to recover from.
      return;
    }

    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), RESET_MS);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="mt-3 flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.08em] text-rust underline decoration-rust/30 underline-offset-4 transition-colors hover:decoration-rust"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 flex-none" aria-hidden />
      ) : (
        <Copy className="h-3.5 w-3.5 flex-none" aria-hidden />
      )}
      {copied ? "Address copied" : "Copy address"}
      <span aria-live="polite" className="sr-only">
        {copied && "Mailing address copied to your clipboard"}
      </span>
    </button>
  );
}
