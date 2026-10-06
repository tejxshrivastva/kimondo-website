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
    heading: "Catalog",
    items: [
      { href: "/admin/sets", label: "Store" },
      { href: "/admin/campaigns", label: "Archive" },
      { href: "/admin/badges", label: "Badges" },
    ],
  },
  {
    heading: "Site content",
    items: [
      { href: "/admin/homepage", label: "Homepage" },
      { href: "/admin/faqs", label: "FAQ" },
      { href: "/admin/founder", label: "Founder" },
      { href: "/admin/settings", label: "Settings", adminOnly: true },
    ],
  },
  {
    heading: "Operations",
    items: [
      { href: "/admin/orders", label: "Orders", showBadge: true },
      { href: "/admin/notify-requests", label: "Restock requests" },
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
    <aside className="w-[248px] bg-white text-black flex-shrink-0 hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40 border-r border-[rgba(0,0,0,0.12)]">
      <div className="px-6 pt-[22px] pb-5 border-b border-[rgba(0,0,0,0.12)]">
        <div
          className="text-[21px] font-medium tracking-[0.28em]"
          style={{ paddingLeft: "0.28em" }}
        >
          KIMONDO
        </div>
        <div
          className="text-[9px] font-semibold tracking-[0.34em] uppercase text-[#666666] mt-[5px]"
          style={{ paddingLeft: "0.34em" }}
        >
          Studio
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
                <div className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#666666] px-3 pb-2">
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
                    className={`flex items-center justify-between px-3 py-[9px] text-[13px] transition-colors mb-[2px] ${
                      active
                        ? "bg-black text-white font-semibold"
                        : "text-[#666666] hover:text-black hover:bg-[#f8f8f8]"
                    }`}
                  >
                    <span className="flex items-center gap-[10px]">
                      <span
                        className={`w-[5px] h-[5px] rounded-full ${
                          active ? "bg-white" : "bg-current opacity-50"
                        }`}
                      />
                      {label}
                    </span>
                    {showBadge && pendingOrderCount ? (
                      <span
                        className={`text-[10px] font-semibold min-w-[20px] h-5 flex items-center justify-center rounded-full ${
                          active
                            ? "bg-white text-black"
                            : "bg-black text-white"
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

      <div className="border-t border-[rgba(0,0,0,0.12)] p-[14px] mt-auto">
        <div className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#666666] px-3 pb-2">
          Viewing as
        </div>
        <div className="flex gap-[6px] px-[6px] mb-3">
          <span
            className={`text-[11px] px-3 py-[5px] font-medium cursor-default ${
              role === "admin"
                ? "bg-black text-white"
                : "bg-[#f8f8f8] text-[#666666]"
            }`}
          >
            Admin
          </span>
          <span
            className={`text-[11px] px-3 py-[5px] font-medium cursor-default ${
              role === "editor"
                ? "bg-black text-white"
                : "bg-[#f8f8f8] text-[#666666]"
            }`}
          >
            Editor
          </span>
        </div>
        {(userName || userEmail) && (
          <div className="flex items-center gap-[10px] px-3 pt-[14px] pb-1">
            <span className="w-[30px] h-[30px] rounded-full bg-black text-white text-[12px] font-semibold flex items-center justify-center uppercase">
              {(userName || userEmail || "U").slice(0, 2)}
            </span>
            <div className="min-w-0 leading-[1.3]">
              {userName && (
                <p className="text-[12px] font-semibold truncate">{userName}</p>
              )}
              {userEmail && (
                <p className="text-[10.5px] text-[#666666] truncate">
                  {userEmail}
                </p>
              )}
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full mt-3 px-3 py-[9px] text-[12px] text-[#666666] hover:text-black hover:bg-[#f8f8f8] transition-colors text-left"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
