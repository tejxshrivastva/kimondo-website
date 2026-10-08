"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, ShoppingBag, User } from "lucide-react";
import { useOverlayStore } from "@/store/overlay-store";
import { useCart } from "@/hooks/use-cart";

const NAV_LINKS = [
  { href: "/store", label: "Store" },
  { href: "/archive", label: "Archive" },
  { href: "/founder", label: "Founder" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { toggleMenu, openCart, openAuth } = useOverlayStore();
  const { count } = useCart();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[rgba(0,0,0,0.12)]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left — hamburger (mobile) / nav (desktop) */}
          <div className="flex-1 flex items-center">
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 -ml-2"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-[0.2px] transition-opacity ${
                    pathname === link.href
                      ? "opacity-100"
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
          <div className="flex-1 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                if (session?.user) {
                  router.push("/profile");
                } else {
                  openAuth();
                }
              }}
              className="p-2"
              aria-label="Account"
            >
              <User size={20} />
            </button>
            <button
              onClick={() => {
                if (session?.user) {
                  openCart();
                } else {
                  openAuth(() => openCart());
                }
              }}
              className="p-2 -mr-2"
              aria-label="Cart"
            >
              <div className="relative">
                <ShoppingBag size={20} />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-black text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
