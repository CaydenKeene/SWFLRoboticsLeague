"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Wrap } from "@/components/wrap";
import { navItems, site } from "@/content/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  // Every nav target is a section of the home page, so a bare fragment is dead
  // anywhere else. Off the home page the links get a "/" in front; on it they
  // stay pure fragments, which the browser scrolls to without a navigation.
  const prefix = usePathname() === "/" ? "" : "/";

  return (
    <header className="sticky top-0 z-50 bg-navy">
      <Wrap className="flex items-center gap-5 py-3">
        <a href={`${prefix}#welcome`} className="flex flex-none items-center gap-3">
          {/* Decorative: the wordmark beside it carries the accessible name. */}
          <Image
            src="/league-logo-temp.svg"
            alt=""
            width={600}
            height={560}
            priority
            className="h-12 w-auto sm:h-16"
          />
          <span>
            <span className="block font-display text-xs uppercase leading-tight text-white sm:text-sm">
              SWFL Robotics
              <br />
              League
            </span>
            {site.logoNote && (
              <span className="mt-1 block text-[10px] font-semibold uppercase leading-tight tracking-wide text-orange sm:text-[11px]">
                {site.logoNote.map((line, i) => (
                  <span key={line}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </span>
            )}
          </span>
        </a>

        <nav className="ml-auto hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={`${prefix}${item.href}`}
              className="text-sm font-semibold uppercase tracking-wide text-white/85 transition-colors hover:text-orange"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Image
          src="/ftc-logo-horizontal-reverse.png"
          alt="FIRST Tech Challenge"
          width={176}
          height={46}
          priority
          className="ml-auto hidden h-7 w-auto flex-none sm:block sm:h-9 lg:ml-7"
        />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 ml-auto flex-none p-2 text-white sm:ml-2 lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Wrap>

      {open && (
        <nav id="mobile-nav" className="border-t border-white/10 lg:hidden">
          <Wrap className="flex flex-col py-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={`${prefix}${item.href}`}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-semibold uppercase tracking-wide text-white/85"
              >
                {item.label}
              </a>
            ))}
          </Wrap>
        </nav>
      )}
    </header>
  );
}
