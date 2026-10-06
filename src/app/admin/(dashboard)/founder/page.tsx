"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminFounderPage() {
  const [form, setForm] = useState({
    founderEmail: "",
    founderPageTitle: "",
    founderPageSubtitle: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          setForm({
            founderEmail: d.settings.founderEmail || "",
            founderPageTitle: d.settings.founderPageTitle || "",
            founderPageSubtitle: d.settings.founderPageSubtitle || "",
          });
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) toast("Founder page settings saved");
    else toast.error("Failed to save");
  };

  return (
    <div className="max-w-[600px] px-[clamp(14px,3vw,34px)] py-[clamp(18px,3vw,30px)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Founder</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 h-10 px-6 bg-black text-white text-sm font-semibold disabled:opacity-50">
          <Save size={16} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>
      <div className="space-y-6">
        <section>
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-3">Page text</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Page title</label>
              <input
                value={form.founderPageTitle}
                onChange={(e) => setForm((p) => ({ ...p, founderPageTitle: e.target.value }))}
                placeholder="e.g. Write to the founder"
                className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Page subtitle</label>
              <input
                value={form.founderPageSubtitle}
                onChange={(e) => setForm((p) => ({ ...p, founderPageSubtitle: e.target.value }))}
                placeholder="e.g. A direct line to the person behind the cloth"
                className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-3">Contact</h2>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Founder email</label>
            <input
              value={form.founderEmail}
              onChange={(e) => setForm((p) => ({ ...p, founderEmail: e.target.value }))}
              placeholder="founder@kimondo.com"
              className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
            />
            <p className="text-xs text-[#999] mt-1">Messages from the contact form are sent to this email.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
