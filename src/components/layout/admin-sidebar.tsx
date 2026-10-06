"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const SECTIONS = [
  {
    heading: "",
    items: [{ href: "/admin", label: "Overview" }],
  },
  {
    heading: "Content",
    items: [
      { href: "/admin/sets", label: "Sets" },
      { href: "/admin/campaigns", label: "Campaigns" },
      { href: "/admin/badges", label: "Badges" },
      { href: "/admin/faqs", label: "FAQ" },
      { href: "/admin/homepage", label: "Homepage" },
      { href: "/admin/settings", label: "Settings", adminOnly: true },
    ],
  },
  {
    heading: "Operations",
    items: [
      { href: "/admin/orders", label: "Orders", showBadge: true },
      { href: "/admin/notify-requests", label: "Back in stock" },
    ],
  },
  {
    heading: "Accounts",
    items: [{ href: "/admin/users", label: "Users", adminOnly: true }],
  },
];

interface AdminSidebarProps {
  role: string;
  userName?: string;
  userEmail?: string;
  pendingOrderCount?: number;
}

export function AdminSidebar({
  role,
  userName,
  userEmail,
  pendingOrderCount,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[248px] bg-black text-white flex-shrink-0 hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40">
      <div className="px-6 pt-[22px] pb-5 border-b border-white/[0.14]">
        <div
          className="font-display text-[21px] tracking-[0.28em]"
          style={{ paddingLeft: "0.28em" }}
        >
          KIMONDO
        </div>
        <div
          className="text-[9px] font-semibold tracking-[0.34em] uppercase text-white/50 mt-[5px]"
          style={{ paddingLeft: "0.34em" }}
        >
          Content System
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-[14px] py-4">
        {SECTIONS.map((section, si) => {
          const visibleItems = section.items.filter(
            (item) =>
              !("adminOnly" in item && item.adminOnly) || role === "admin"
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={si} className="mb-[18px]">
              {section.heading && (
                <div className="text-[9px] font-semibold tracking-[0.2em] uppercase text-white/[0.38] px-3 pb-2">
                  {section.heading}
                </div>
              )}
              {visibleItems.map((item) => {
                const { href, label } = item;
                const showBadge = "showBadge" in item && item.showBadge;
                const active =
                  href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center justify-between px-3 py-[9px] rounded-[10px] text-[13px] transition-colors mb-[2px] ${
                      active
                        ? "bg-white text-black font-semibold"
                        : "text-white/70 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    <span className="flex items-center gap-[10px]">
                      <span
                        className={`w-[5px] h-[5px] rounded-full ${
                          active ? "bg-black" : "bg-current opacity-50"
                        }`}
                      />
                      {label}
                    </span>
                    {showBadge && pendingOrderCount ? (
                      <span
                        className={`text-[10px] font-semibold min-w-[20px] h-5 flex items-center justify-center rounded-full ${
                          active
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        {pendingOrderCount}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.14] p-[14px] mt-auto">
        <div className="text-[9px] font-semibold tracking-[0.2em] uppercase text-white/[0.38] px-3 pb-2">
          Viewing as
        </div>
        <div className="flex gap-[6px] px-[6px] mb-3">
          <span
            className={`text-[11px] px-3 py-[5px] rounded-full font-medium cursor-default ${
              role === "admin"
                ? "bg-white text-black"
                : "bg-white/10 text-white/50"
            }`}
          >
            Admin
          </span>
          <span
            className={`text-[11px] px-3 py-[5px] rounded-full font-medium cursor-default ${
              role === "editor"
                ? "bg-white text-black"
                : "bg-white/10 text-white/50"
            }`}
          >
            Editor
          </span>
        </div>
        {(userName || userEmail) && (
          <div className="flex items-center gap-[10px] px-3 pt-[14px] pb-1">
            <span className="w-[30px] h-[30px] rounded-full bg-white text-black text-[12px] font-semibold flex items-center justify-center uppercase">
              {(userName || userEmail || "U").slice(0, 2)}
            </span>
            <div className="min-w-0 leading-[1.3]">
              {userName && (
                <p className="text-[12px] font-semibold truncate">{userName}</p>
              )}
              {userEmail && (
                <p className="text-[10.5px] text-white/50 truncate">
                  {userEmail}
                </p>
              )}
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full mt-3 px-3 py-[9px] text-[12px] text-white/50 hover:text-white hover:bg-white/[0.08] rounded-[10px] transition-colors text-left"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
