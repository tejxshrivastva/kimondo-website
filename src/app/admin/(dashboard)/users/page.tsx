import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Users</h1>
      <div className="border border-[rgba(0,0,0,0.12)] rounded-[12px] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(0,0,0,0.08)] bg-surface">
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Role</th>
              <th className="text-center p-3 font-medium">Orders</th>
              <th className="text-left p-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[rgba(0,0,0,0.04)] last:border-0">
                <td className="p-3">{user.email}</td>
                <td className="p-3 text-muted">{user.name || "—"}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === "admin" ? "bg-black text-white" : user.role === "editor" ? "bg-blue-100 text-blue-800" : "bg-surface"}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-3 text-center">{user._count.orders}</td>
                <td className="p-3 text-xs text-muted">{user.createdAt.toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
