"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface Settings {
  returnWindowDays: number;
  exchangeWindowDays: number;
  founderEmail: string;
  socialLinks: string;
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Settings>({
    returnWindowDays: 14,
    exchangeWindowDays: 14,
    founderEmail: "hello@kimondo.in",
    socialLinks: "{}",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          setForm({
            returnWindowDays: d.settings.returnWindowDays,
            exchangeWindowDays: d.settings.exchangeWindowDays,
            founderEmail: d.settings.founderEmail || "",
            socialLinks: JSON.stringify(d.settings.socialLinks || {}),
          });
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        socialLinks: JSON.parse(form.socialLinks || "{}"),
      }),
    });
    setSaving(false);
    if (res.ok) toast("Settings saved");
    else toast.error("Failed to save");
  };

  return (
    <div className="max-w-[1200px] px-[clamp(14px,3vw,34px)] py-[clamp(18px,3vw,30px)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light">Settings</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 h-10 px-6 bg-black text-white text-sm font-semibold  disabled:opacity-50">
          <Save size={16} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Return window (days)</label>
            <input type="number" value={form.returnWindowDays} onChange={(e) => setForm((p) => ({ ...p, returnWindowDays: Number(e.target.value) }))} className="w-full border border-[rgba(0,0,0,0.16)]  p-3 text-sm focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Exchange window (days)</label>
            <input type="number" value={form.exchangeWindowDays} onChange={(e) => setForm((p) => ({ ...p, exchangeWindowDays: Number(e.target.value) }))} className="w-full border border-[rgba(0,0,0,0.16)]  p-3 text-sm focus:outline-none focus:border-black" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Founder email</label>
          <input value={form.founderEmail} onChange={(e) => setForm((p) => ({ ...p, founderEmail: e.target.value }))} className="w-full border border-[rgba(0,0,0,0.16)]  p-3 text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Social links (JSON)</label>
          <textarea value={form.socialLinks} onChange={(e) => setForm((p) => ({ ...p, socialLinks: e.target.value }))} rows={4} className="w-full border border-[rgba(0,0,0,0.16)]  p-3 text-xs font-mono focus:outline-none focus:border-black resize-none" />
        </div>
      </div>
    </div>
  );
}
