import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export const metadata = {
  title: {
    absolute: "Kimondo Admin",
    template: "%s | Kimondo Admin",
  },
};

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
    <div className="min-h-screen bg-white font-admin text-[15px]">
      <AdminSidebar
        role={session.user.role || "editor"}
        userName={session.user.name || undefined}
        userEmail={session.user.email || undefined}
        pendingOrderCount={pendingOrderCount}
      />
      <div className="lg:ml-[248px] min-h-screen flex flex-col">
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
