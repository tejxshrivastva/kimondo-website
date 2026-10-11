"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOverlayStore } from "@/store/overlay-store";
import { useCart } from "@/hooks/use-cart";

const NAV_LINKS = [
  { href: "/founder", label: "The Maker" },
  { href: "/archive", label: "Archive" },
  { href: "/store", label: "Shop" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { toggleMenu, openCart, openAuth } = useOverlayStore();
  const { count } = useCart();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  const isLinkActive = (href: string) => {
    if (href === "/store") return pathname === "/store" || pathname.startsWith("/store/");
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left — "Menu" text (mobile) / nav links (desktop) */}
          <div className="flex-1 flex items-center">
            <button
              onClick={toggleMenu}
              className="lg:hidden text-[11px] font-medium tracking-[0.08em] uppercase"
              aria-label="Menu"
            >
              Menu
            </button>
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] tracking-[0.08em] uppercase transition-opacity ${
                    isLinkActive(link.href)
                      ? "opacity-100 underline underline-offset-4 decoration-[1px]"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Logo — always centered */}
          <Link
            href="/"
            className="tracking-[0.3em] uppercase text-base font-medium shrink-0"
          >
            KIMONDO
          </Link>

          {/* Right actions */}
          <div className="flex-1 flex items-center justify-end gap-6">
            {/* Profile — desktop only */}
            <button
              onClick={() => {
                if (session?.user) {
                  router.push("/profile");
                } else {
                  openAuth();
                }
              }}
              className="hidden lg:block text-[11px] tracking-[0.08em] uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              Profile
            </button>
            {/* Bag — always visible */}
            <button
              onClick={() => {
                if (session?.user) {
                  openCart();
                } else {
                  openAuth(() => openCart());
                }
              }}
              className="text-[11px] tracking-[0.08em] uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              <span className="lg:hidden">Bag</span>
              <span className="hidden lg:inline">Bag ({count})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
