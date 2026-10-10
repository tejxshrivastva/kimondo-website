"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { adminSignOut } from "@/app/admin/actions";

const SECTIONS = [
  {
    heading: "",
    items: [
      { href: "/admin", label: "Overview" },
      { href: "/admin/orders", label: "Orders", showBadge: true, adminOnly: true },
      { href: "/admin/waitlist", label: "Waitlist", adminOnly: true },
      { href: "/admin/notify-requests", label: "Restock requests", adminOnly: true },
    ],
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
      { href: "/admin/pages", label: "Pages" },
      { href: "/admin/faqs", label: "FAQ" },
      { href: "/admin/founder", label: "Founder" },
      { href: "/admin/settings", label: "Settings", adminOnly: true },
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const sidebarContent = (
    <>
      <div className="px-6 pt-[22px] pb-5 border-b border-[rgba(0,0,0,0.12)] flex items-center justify-between">
        <div>
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
            Admin
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 text-[#666666] hover:text-black"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
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
        <form action={adminSignOut}>
          <button
            type="submit"
            className="w-full mt-3 px-3 py-[9px] text-[12px] text-[#666666] hover:text-black hover:bg-[#f8f8f8] transition-colors text-left"
          >
            Sign out
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-[rgba(0,0,0,0.12)] flex items-center h-12 px-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <span className="text-[13px] font-semibold tracking-[0.15em] uppercase ml-2">Kimondo Admin</span>
      </div>

      {/* Mobile backdrop */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`w-[248px] bg-white text-black flex-shrink-0 flex flex-col fixed top-0 left-0 bottom-0 z-50 border-r border-[rgba(0,0,0,0.12)] transition-transform duration-200 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
