"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Wrap } from "@/components/wrap";
import { navItems } from "@/content/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  // Every nav target is a section of the home page, so a bare fragment is dead
  // anywhere else. Off the home page the links get a "/" in front; on it they
  // stay pure fragments, which the browser scrolls to without a navigation.
  const prefix = usePathname() === "/" ? "" : "/";

  return (
    <header className="sticky top-0 z-50 bg-navy">
      <Wrap className="flex items-center gap-5 py-3">
        <a href={`${prefix}#welcome`} className="flex-none">
          {/* The artwork has a white ground and black lettering, so it sits on a
              white plate rather than directly on the navy bar. */}
          <span className="block rounded-md bg-white px-2 py-1">
            <Image
              src="/league-logo.png"
              alt="SWFL Robotics League"
              width={1647}
              height={660}
              sizes="(min-width: 640px) 180px, 120px"
              priority
              className="h-12 w-auto sm:h-[72px]"
            />
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
