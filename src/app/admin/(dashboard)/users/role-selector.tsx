"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ROLES = ["customer", "editor", "admin"] as const;
const ROLE_STYLES: Record<string, string> = {
  admin: "bg-black text-white",
  editor: "bg-blue-100 text-blue-800",
  customer: "bg-[#f0f0ee] text-[#1a1a1a]",
};

export function RoleSelector({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const handleChange = async (newRole: string) => {
    if (newRole === currentRole) return;
    setUpdating(true);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });
    setUpdating(false);
    if (res.ok) {
      toast("Role updated");
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to update role");
    }
  };

  return (
    <select
      value={currentRole}
      onChange={(e) => handleChange(e.target.value)}
      disabled={updating}
      className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer disabled:opacity-50 ${ROLE_STYLES[currentRole] || ROLE_STYLES.customer}`}
    >
      {ROLES.map((role) => (
        <option key={role} value={role}>{role}</option>
      ))}
    </select>
  );
}
