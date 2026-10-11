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
    { href: "/founder", label: "Founder" },
    { href: "https://instagram.com/kimondo", label: "Instagram" },
  ],
};

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  if (pathname.match(/^\/store\/.+/)) return null;

  return (
    <footer className="bg-[#f8f8f8] text-black mt-auto">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#666666] mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-black/60 hover:text-black transition-colors"
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
        <div className="border-t border-[rgba(0,0,0,0.12)] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            href="/"
            className="tracking-[0.3em] uppercase text-base font-medium"
          >
            KIMONDO
          </Link>
          <p className="text-xs text-[#666666]">
            Kimondo
          </p>
        </div>
      </div>
    </footer>
  );
}
