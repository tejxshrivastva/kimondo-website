import { prisma } from "@/lib/prisma";

export default async function AdminWaitlistPage() {
  const signups = await prisma.waitlistSignup.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-[clamp(14px,3vw,34px)] py-[clamp(18px,3vw,30px)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Waitlist</h1>
        <span className="text-sm text-[#666666]">
          {signups.length} signup{signups.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="border border-[rgba(0,0,0,0.12)] overflow-x-auto -mx-[clamp(14px,3vw,34px)] sm:mx-0 border-x-0 sm:border-x">
        <table className="w-full text-sm min-w-[420px]">
          <thead>
            <tr className="border-b border-[rgba(0,0,0,0.08)] bg-[#f8f8f8]">
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Phone</th>
              <th className="text-left p-3 font-medium">Signed up</th>
            </tr>
          </thead>
          <tbody>
            {signups.map((s) => (
              <tr key={s.id} className="border-b border-[rgba(0,0,0,0.04)] last:border-0">
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.phone || "-"}</td>
                <td className="p-3 text-[#666666]">
                  {s.createdAt.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {signups.length === 0 && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-[#666666]">
                  No signups yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
