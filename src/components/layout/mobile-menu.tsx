"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useOverlayStore } from "@/store/overlay-store";

const NAV_LINKS = [
  { href: "/store", label: "Store" },
  { href: "/archive", label: "Archive" },
  { href: "/founder", label: "Founder" },
  { href: "/faq", label: "FAQ" },
];

export function MobileMenu() {
  const pathname = usePathname();
  const { menuOpen, closeMenu } = useOverlayStore();

  if (!menuOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeMenu}
      />

      {/* Panel */}
      <nav className="absolute inset-y-0 left-0 w-[280px] bg-white animate-slide-in-left flex flex-col">
        {/* Close button */}
        <div className="flex items-center justify-end h-16 px-4">
          <button
            onClick={closeMenu}
            className="p-2 -mr-2"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-1 px-6 pt-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`text-lg tracking-wide py-3 transition-opacity ${
                pathname === link.href
                  ? "opacity-100"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
