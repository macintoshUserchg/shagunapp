"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navigationLinks = [
  { href: "#featured", label: "Featured" },
  { href: "#collections", label: "Collections" },
  { href: "#menu", label: "Menu" },
  { href: "#stores", label: "Stores" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        className="theme-toggle-btn md:hidden"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mx-4 mt-2 rounded-[24px] border border-border bg-surface p-4 shadow-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted hover:bg-muted/10 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
