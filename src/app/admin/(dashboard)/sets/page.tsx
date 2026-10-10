import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export default async function AdminSetsPage() {
  const sets = await prisma.set.findMany({
    include: {
      items: { include: { variants: true } },
      _count: { select: { items: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="px-[clamp(14px,3vw,34px)] py-[clamp(18px,3vw,30px)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Products</h1>
        <Link
          href="/admin/sets/new"
          className="flex items-center gap-2 h-10 px-4 bg-black text-white text-sm font-semibold"
        >
          <Plus size={16} /> New product
        </Link>
      </div>

      <div className="border border-[rgba(0,0,0,0.12)] overflow-x-auto -mx-[clamp(14px,3vw,34px)] sm:mx-0 border-x-0 sm:border-x">
        <table className="w-full text-sm min-w-[540px]">
          <thead>
            <tr className="border-b border-[rgba(0,0,0,0.08)] bg-[#f8f8f8]">
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Items</th>
              <th className="text-left p-3 font-medium">Stock</th>
              <th className="text-right p-3 font-medium">Min price</th>
            </tr>
          </thead>
          <tbody>
            {sets.map((set) => {
              const totalStock = set.items.reduce(
                (sum, item) =>
                  sum + item.variants.reduce((vs, v) => vs + v.stock, 0),
                0
              );
              const minPrice = Math.min(
                ...set.items.map((i) => i.price),
                Infinity
              );
              return (
                <tr
                  key={set.id}
                  className="border-b border-[rgba(0,0,0,0.04)] last:border-0 hover:bg-[#f8f8f8]/50"
                >
                  <td className="p-3">
                    <Link
                      href={`/admin/sets/${set.id}`}
                      className="font-medium hover:underline"
                    >
                      {set.name}
                    </Link>
                    <p className="text-xs text-muted">{set.slug}</p>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-0.5 ${
                        set.status === "live"
                          ? "bg-black text-white"
                          : set.status === "draft"
                            ? "bg-[#f8f8f8] text-[#666666]"
                            : "bg-[#f8f8f8] text-[#666666]"
                      }`}
                    >
                      {set.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted">{set._count.items}</td>
                  <td className="p-3 text-muted">{totalStock}</td>
                  <td className="p-3 text-right">
                    {minPrice === Infinity
                      ? "-"
                      : `₹${(minPrice / 100).toLocaleString("en-IN")}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
