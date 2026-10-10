import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { email: true, name: true } },
      _count: { select: { orderLines: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-[clamp(14px,3vw,34px)] py-[clamp(18px,3vw,30px)]">
      <h1 className="text-2xl font-light mb-6">Orders</h1>
      <div className="border border-[rgba(0,0,0,0.12)] overflow-x-auto -mx-[clamp(14px,3vw,34px)] sm:mx-0 border-x-0 sm:border-x">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-[rgba(0,0,0,0.08)] bg-[#f8f8f8]">
              <th className="text-left p-3 font-medium">Order</th>
              <th className="text-left p-3 font-medium">Customer</th>
              <th className="text-left p-3 font-medium">Items</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-right p-3 font-medium">Total</th>
              <th className="text-left p-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[rgba(0,0,0,0.04)] last:border-0 hover:bg-[#f8f8f8]/50">
                <td className="p-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs font-medium hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="p-3 text-muted">{order.user.name || order.user.email}</td>
                <td className="p-3 text-muted">{order._count.orderLines}</td>
                <td className="p-3">
                  <span className="text-xs px-2 py-0.5 bg-[#f8f8f8] capitalize">
                    {order.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="p-3 text-right">₹{(order.totalMinor / 100).toLocaleString("en-IN")}</td>
                <td className="p-3 text-xs text-muted">
                  {order.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-muted">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
