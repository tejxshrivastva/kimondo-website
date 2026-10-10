"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminPagesPage() {
  const [form, setForm] = useState({
    storePageTitle: "",
    storePageSubtitle: "",
    archivePageTitle: "",
    archivePageSubtitle: "",
    faqPageTitle: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          setForm({
            storePageTitle: d.settings.storePageTitle || "",
            storePageSubtitle: d.settings.storePageSubtitle || "",
            archivePageTitle: d.settings.archivePageTitle || "",
            archivePageSubtitle: d.settings.archivePageSubtitle || "",
            faqPageTitle: d.settings.faqPageTitle || "",
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
    if (res.ok) toast("Page text saved");
    else toast.error("Failed to save");
  };

  return (
    <div className="max-w-[1200px] px-[clamp(14px,3vw,34px)] py-[clamp(18px,3vw,30px)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Pages</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 h-10 px-6 bg-black text-white text-sm font-semibold disabled:opacity-50">
          <Save size={16} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>
      <p className="text-xs text-[#666666] mb-6">Edit the titles and subtitles shown on each page. Leave blank to use the default text.</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-3">Store page</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Page title</label>
              <input
                value={form.storePageTitle}
                onChange={(e) => setForm((p) => ({ ...p, storePageTitle: e.target.value }))}
                placeholder="Store"
                className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Page subtitle</label>
              <input
                value={form.storePageSubtitle}
                onChange={(e) => setForm((p) => ({ ...p, storePageSubtitle: e.target.value }))}
                placeholder="Browse the full collection."
                className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-3">Archive page</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Page title</label>
              <input
                value={form.archivePageTitle}
                onChange={(e) => setForm((p) => ({ ...p, archivePageTitle: e.target.value }))}
                placeholder="The Archive"
                className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Page subtitle</label>
              <input
                value={form.archivePageSubtitle}
                onChange={(e) => setForm((p) => ({ ...p, archivePageSubtitle: e.target.value }))}
                placeholder="Optional subtitle for the archive page"
                className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-3">FAQ page</h2>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Page title</label>
            <input
              value={form.faqPageTitle}
              onChange={(e) => setForm((p) => ({ ...p, faqPageTitle: e.target.value }))}
              placeholder="Questions we hear often"
              className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
