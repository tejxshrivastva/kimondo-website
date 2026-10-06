import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { OrderActions } from "./actions";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, name: true } },
      orderLines: true,
      returnRequests: true,
    },
  });

  if (!order) notFound();

  const address = JSON.parse(order.addressSnapshot || "{}");

  return (
    <div className="max-w-[800px] px-[clamp(14px,3vw,34px)] py-[clamp(18px,3vw,30px)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl">{order.orderNumber}</h1>
          <p className="text-xs text-muted mt-1">
            {order.createdAt.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <span className="text-sm px-3 py-1 bg-[#f8f8f8] capitalize">
          {order.status.replace(/_/g, " ")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="border border-[rgba(0,0,0,0.12)] p-4">
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-muted mb-2">Customer</p>
          <p className="text-sm font-medium">{order.user.name || order.user.email}</p>
          <p className="text-xs text-muted">{order.user.email}</p>
        </div>
        <div className="border border-[rgba(0,0,0,0.12)] p-4">
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-muted mb-2">Delivery</p>
          <p className="text-sm">{address.fullName}</p>
          <p className="text-xs text-muted">{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
          <p className="text-xs text-muted">{address.city}, {address.state} — {address.pincode}</p>
          <p className="text-xs text-muted">{address.phone}</p>
        </div>
      </div>

      <div className="border border-[rgba(0,0,0,0.12)] mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(0,0,0,0.08)] bg-[#f8f8f8]">
              <th className="text-left p-3 font-medium">Item</th>
              <th className="text-left p-3 font-medium">Size</th>
              <th className="text-center p-3 font-medium">Qty</th>
              <th className="text-right p-3 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.orderLines.map((line) => (
              <tr key={line.id} className="border-b border-[rgba(0,0,0,0.04)] last:border-0">
                <td className="p-3">
                  <p className="font-medium">{line.itemName}</p>
                  <p className="text-xs text-muted">{line.setName}</p>
                </td>
                <td className="p-3 text-muted">{line.size}</td>
                <td className="p-3 text-center">{line.quantity}</td>
                <td className="p-3 text-right">₹{((line.unitPriceMinor * line.quantity) / 100).toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-[rgba(0,0,0,0.08)]">
              <td colSpan={3} className="p-3 font-medium text-right">Total</td>
              <td className="p-3 text-right font-display text-lg">₹{(order.totalMinor / 100).toLocaleString("en-IN")}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <OrderActions orderId={order.id} currentStatus={order.status} />

      {order.returnRequests.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-3">Returns/Exchanges</h2>
          {order.returnRequests.map((ret) => (
            <div key={ret.id} className="border border-[rgba(0,0,0,0.12)] p-4 mb-2">
              <p className="text-sm font-medium capitalize">{ret.type}</p>
              <p className="text-xs text-muted">{ret.reason}</p>
              <p className="text-xs mt-1">
                Status:{" "}
                <span className="capitalize">{ret.status.replace(/_/g, " ")}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
