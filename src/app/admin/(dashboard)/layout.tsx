import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || !["admin", "editor"].includes(session.user.role || "")) {
    redirect("/admin/login");
  }

  const pendingOrderCount = await prisma.order.count({
    where: { status: { in: ["confirmed", "payment_pending"] } },
  });

  return (
    <div className="min-h-screen bg-[#f2f1ef]">
      <AdminSidebar
        role={session.user.role || "editor"}
        userName={session.user.name || undefined}
        userEmail={session.user.email || undefined}
        pendingOrderCount={pendingOrderCount}
      />
      <div className="lg:ml-[248px] min-h-screen flex flex-col">
        <header className="sticky top-0 z-15 bg-[#f2f1ef]/[0.92] backdrop-blur-[10px] border-b border-[#e2e1de]">
          <div className="px-[clamp(14px,3vw,34px)] py-[11px]" />
        </header>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
