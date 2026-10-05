import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminOverview() {
  const [
    toAcceptCount,
    inFulfilmentCount,
    returnCount,
    restockAlertCount,
    actionOrders,
    lowStockVariants,
  ] = await Promise.all([
    prisma.order.count({ where: { status: "confirmed" } }),
    prisma.order.count({
      where: { status: { in: ["accepted", "shipped"] } },
    }),
    prisma.returnRequest.count({ where: { status: "pending" } }),
    prisma.variant.count({
      where: {
        stock: { lte: 3 },
        item: { set: { status: "live" } },
      },
    }),
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
    prisma.variant.findMany({
      where: {
        stock: { lte: 3 },
        item: { set: { status: "live" } },
      },
      take: 8,
      orderBy: { stock: "asc" },
      include: {
        item: {
          select: {
            name: true,
            set: { select: { name: true } },
          },
        },
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
    {
      label: "Restock alerts",
      value: restockAlertCount,
      desc: "Variants with waitlists",
    },
  ];

  const statusLabel: Record<string, string> = {
    confirmed: "Placed",
    accepted: "Accepted",
    shipped: "Shipped",
    payment_pending: "Pending",
  };

  return (
    <div className="px-[clamp(14px,3vw,34px)] py-[clamp(18px,3vw,30px)]">
      <div className="mb-7">
        <div className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#8a8a86] mb-[3px]">
          Dashboard
        </div>
        <div className="font-display text-[clamp(18px,2.4vw,26px)] leading-[1.05]">
          Overview
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {stats.map(({ label, value, desc }) => (
          <div
            key={label}
            className="bg-white border border-[#e2e1de] rounded-[12px] px-[22px] py-5"
          >
            <div className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[#8a8a86] mb-[14px]">
              {label}
            </div>
            <div className="font-display text-[clamp(30px,3.2vw,40px)] leading-none">
              {value}
            </div>
            <div className="text-[11.5px] text-[#8a8a86] mt-[6px]">{desc}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#e2e1de] rounded-[12px] overflow-x-auto">
          <div className="px-[22px] py-[18px] border-b border-[#eeede9] flex items-center justify-between">
            <div className="font-display text-[18px]">Orders to action</div>
            <Link
              href="/admin/orders"
              className="text-[10px] font-semibold tracking-[0.14em] uppercase"
            >
              All orders &rarr;
            </Link>
          </div>
          {actionOrders.length === 0 ? (
            <div className="px-[22px] py-10 text-center text-[13px] text-[#8a8a86]">
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
                  className="flex items-center gap-4 px-[22px] py-[15px] border-b border-[#f2f1ee] last:border-0 hover:bg-[#fafaf8] transition-colors"
                >
                  <div className="w-10 h-[50px] rounded-lg bg-gradient-to-br from-[#d9d9d9] to-[#bcbcbc] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold">
                      #{order.orderNumber}
                    </div>
                    <div className="text-[11.5px] text-[#8a8a86]">
                      {setNames.join(", ")} &middot;{" "}
                      {order.orderLines.length} item
                      {order.orderLines.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <span className="text-[11px] font-medium px-[10px] py-[4px] rounded-full bg-[#f0f0ee] text-[#1a1a1a]">
                    {displayStatus}
                  </span>
                  <span className="font-display text-[16px]">
                    &#8377;
                    {(order.totalMinor / 100).toLocaleString("en-IN")}
                  </span>
                </Link>
              );
            })
          )}
        </div>

        <div className="bg-white border border-[#e2e1de] rounded-[12px] overflow-x-auto">
          <div className="px-[22px] py-[18px] border-b border-[#eeede9] font-display text-[18px]">
            Low &amp; out of stock
          </div>
          {lowStockVariants.length === 0 ? (
            <div className="px-[22px] py-10 text-center text-[13px] text-[#8a8a86]">
              All variants well stocked
            </div>
          ) : (
            lowStockVariants.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-3 px-[22px] py-[13px] border-b border-[#f2f1ee] last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-semibold">
                    {v.item.name} &middot; {v.size}
                  </div>
                  <div className="text-[11px] text-[#8a8a86]">
                    {v.item.set.name}
                  </div>
                </div>
                <span
                  className={`text-[11px] font-semibold px-[10px] py-[4px] rounded-full ${
                    v.stock === 0
                      ? "bg-black text-white"
                      : "bg-[#f0f0ee] text-[#1a1a1a]"
                  }`}
                >
                  {v.stock === 0 ? "Out" : `${v.stock} left`}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
