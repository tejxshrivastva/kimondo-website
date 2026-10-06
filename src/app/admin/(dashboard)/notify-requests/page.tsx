import { prisma } from "@/lib/prisma";

export default async function AdminNotifyPage() {
  const requests = await prisma.notifyRequest.findMany({
    include: {
      user: { select: { email: true } },
      variant: {
        include: {
          item: {
            include: { set: { select: { name: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-[clamp(14px,3vw,34px)] py-[clamp(18px,3vw,30px)]">
      <h1 className="font-display text-2xl mb-6">Back-in-stock requests</h1>
      <div className="border border-[rgba(0,0,0,0.12)] rounded-[12px] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(0,0,0,0.08)] bg-surface">
              <th className="text-left p-3 font-medium">User</th>
              <th className="text-left p-3 font-medium">Item</th>
              <th className="text-left p-3 font-medium">Size</th>
              <th className="text-center p-3 font-medium">Stock</th>
              <th className="text-left p-3 font-medium">Notified</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b border-[rgba(0,0,0,0.04)] last:border-0">
                <td className="p-3">{req.user?.email || req.email}</td>
                <td className="p-3">
                  {req.variant.item.name}
                  <span className="text-xs text-muted ml-1">({req.variant.item.set.name})</span>
                </td>
                <td className="p-3">{req.variant.size}</td>
                <td className="p-3 text-center">
                  <span className={req.variant.stock > 0 ? "text-green-700" : "text-red-600"}>
                    {req.variant.stock}
                  </span>
                </td>
                <td className="p-3">{req.notified ? "Yes" : "No"}</td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-muted">No requests</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
