"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Wrap } from "@/components/wrap";
import { navItems } from "@/content/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy">
      <Wrap className="flex items-center gap-5 py-3">
        <a href="#welcome" className="flex-none" aria-label="SWFL Robotics League home">
          <Image
            src="/league-logo-temp.svg"
            alt="SWFL Robotics League logo (temporary)"
            width={600}
            height={560}
            priority
            className="h-14 w-auto sm:h-20"
          />
        </a>

        <nav className="ml-auto hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
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
          className="ml-auto h-7 w-auto flex-none sm:h-9 lg:ml-7"
        />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 flex-none p-2 text-white lg:hidden"
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
                href={item.href}
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
