import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminOverview() {
  const [
    toAcceptCount,
    inFulfilmentCount,
    returnCount,
    actionOrders,
  ] = await Promise.all([
    prisma.order.count({ where: { status: "confirmed" } }),
    prisma.order.count({
      where: { status: { in: ["accepted", "shipped"] } },
    }),
    prisma.returnRequest.count({ where: { status: "pending" } }),
    prisma.order.findMany({
      where: {
        status: { in: ["confirmed", "accepted", "shipped"] },
      },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        orderLines: { select: { setName: true } },
        returnRequests: { where: { status: "pending" }, select: { id: true } },
      },
    }),
  ]);

  const stats = [
    { label: "To accept", value: toAcceptCount, desc: "New paid orders" },
    {
      label: "In fulfilment",
      value: inFulfilmentCount,
      desc: "Accepted → out for delivery",
    },
    { label: "Returns", value: returnCount, desc: "Awaiting action" },
  ];

  const statusLabel: Record<string, string> = {
    confirmed: "Placed",
    accepted: "Accepted",
    processed: "Processed",
    shipped: "Shipped",
    in_transit: "In transit",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
    payment_pending: "Pending",
  };

  return (
    <div className="px-[clamp(14px,3vw,34px)] py-[clamp(18px,3vw,30px)]">
      <div className="mb-7">
        <div className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#666666] mb-[3px]">
          Dashboard
        </div>
        <div className="font-display text-[clamp(18px,2.4vw,26px)] leading-[1.05]">
          Overview
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-7">
        {stats.map(({ label, value, desc }) => (
          <div
            key={label}
            className="bg-white border border-[rgba(0,0,0,0.12)] px-4 sm:px-[22px] py-4 sm:py-5"
          >
            <div className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[#666666] mb-[14px]">
              {label}
            </div>
            <div className="font-display text-[clamp(30px,3.2vw,40px)] leading-none">
              {value}
            </div>
            <div className="text-[11.5px] text-[#666666] mt-[6px]">{desc}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[rgba(0,0,0,0.12)] overflow-x-auto">
        <div className="px-[22px] py-[18px] border-b border-[rgba(0,0,0,0.08)] flex items-center justify-between">
          <div className="font-display text-[18px]">Orders to action</div>
          <Link
            href="/admin/orders"
            className="text-[10px] font-semibold tracking-[0.14em] uppercase"
          >
            All orders &rarr;
          </Link>
        </div>
        {actionOrders.length === 0 ? (
          <div className="px-[22px] py-10 text-center text-[13px] text-[#666666]">
            No orders need attention
          </div>
        ) : (
          actionOrders.map((order) => {
            const setNames = [
              ...new Set(order.orderLines.map((l) => l.setName)),
            ];
            const hasReturn = order.returnRequests.length > 0;
            const displayStatus = hasReturn
              ? "Return"
              : statusLabel[order.status] || order.status;

            return (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-[22px] py-[15px] border-b border-[rgba(0,0,0,0.06)] last:border-0 hover:bg-[#f8f8f8] transition-colors"
              >
                <div className="w-10 h-[50px] bg-[#f8f8f8] flex-shrink-0 hidden sm:block" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold">
                    #{order.orderNumber}
                  </div>
                  <div className="text-[11.5px] text-[#666666] truncate">
                    {setNames.join(", ")} &middot;{" "}
                    {order.orderLines.length} item
                    {order.orderLines.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <span className="text-[11px] font-medium px-[10px] py-[4px] bg-[#f8f8f8] text-[#1a1a1a] flex-shrink-0">
                  {displayStatus}
                </span>
                <span className="font-display text-[16px] flex-shrink-0 hidden sm:block">
                  &#8377;
                  {(order.totalMinor / 100).toLocaleString("en-IN")}
                </span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
