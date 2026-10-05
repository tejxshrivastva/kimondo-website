"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const FOOTER_LINKS = {
  Shop: [
    { href: "/store", label: "Store" },
    { href: "/archive", label: "Archive" },
  ],
  Help: [
    { href: "/faq", label: "FAQ" },
    { href: "/policy/shipping", label: "Shipping" },
    { href: "/policy/returns", label: "Returns" },
    { href: "/policy/cancellation", label: "Cancellation" },
  ],
  Legal: [
    { href: "/policy/privacy", label: "Privacy" },
    { href: "/policy/terms", label: "Terms" },
  ],
  Connect: [
    { href: "/founder", label: "Write to the founder" },
    { href: "https://instagram.com/kimondo", label: "Instagram" },
  ],
};

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-black text-[#f5f5f5] mt-auto">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#757575] mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            href="/"
            className="font-display text-lg tracking-wide uppercase"
          >
            Kimondo
          </Link>
          <p className="text-xs text-[#757575]">
            hello@kimondo.in
          </p>
        </div>
      </div>
    </footer>
  );
}
