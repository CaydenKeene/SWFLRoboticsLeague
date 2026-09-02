import { site } from "@/content/site";

/**
 * Copy and data for the donation popup.
 *
 * The Stripe payment link itself lives in `site.donateUrl`, alongside the other
 * league-wide values; everything specific to the popup lives here.
 */
export const donate = {
  /**
   * Web3Forms access key. Get one free at https://web3forms.com by entering the
   * league address — they email it back immediately, no account needed. The key
   * only ever routes mail to the address it was registered with, so it is safe
   * in this public repo.
   *
   * An empty string skips the form entirely: the check option shows the mailing
   * address directly rather than collecting details it can't deliver.
   */
  web3formsKey: "" as string,

  intro:
    "Thank you for your interest in donating to SWFL Robotics, Inc. Every gift goes toward field kits, venues, and awards for our teams. Choose how you'd like to give.",

  stripe: {
    label: "Give online with a card",
    blurb:
      "The fastest way to give. Stripe handles the payment on its own secure page and emails you a receipt.",
    /**
     * Stripe's nonprofit rate, which the league qualifies for as a 501(c)(3).
     * The standard rate is 2.9% + 30¢ — update this if the league's rate changes.
     */
    feeNote: "Stripe deducts a processing fee of 2.2% + 30¢ from each donation.",
  },

  check: {
    label: "Mail a check",
    blurb:
      "No processing fee, so the full amount reaches the league. Tell us it's on the way and we'll watch for it.",
  },

  form: {
    heading: "Tell us about your gift",
    intro:
      "This lets us expect your check and send a tax acknowledgment. The mailing address is on the next screen.",
    /**
     * Choices in the "Going to" dropdown. Donors can type their own instead, so
     * this is a shortcut list rather than a closed set — add a team by adding a
     * line here.
     */
    designations: ["The league (general fund)", "#14725 Java The Hutts"],
    submitLabel: "Get the mailing address",
  },

  /** Who to make the check out to — the legal entity, not the league's display name. */
  payableTo: site.organization,
  /** Street lines only; `payableTo` renders above them as the first line. */
  mailingAddress: ["10970 S. Cleveland Ave, Ste 405", "Fort Myers, FL 33907"],

  sent: {
    heading: "Where to mail your check",
    thanks: "Thank you — we'll watch for it.",
    acknowledgment:
      "SWFL Robotics, Inc. is a nonprofit. We'll send an acknowledgment for your records once your check arrives.",
  },
} as const;
