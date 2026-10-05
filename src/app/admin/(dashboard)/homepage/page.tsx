"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface HomepageSettings {
  heroImage: string;
  heroImageMobile: string;
  ctaLabel: string;
  ctaTarget: string;
  featuredSetIds: string;
}

export default function AdminHomepagePage() {
  const [form, setForm] = useState<HomepageSettings>({
    heroImage: "",
    heroImageMobile: "",
    ctaLabel: "",
    ctaTarget: "",
    featuredSetIds: "[]",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          setForm({
            heroImage: d.settings.heroImage || "",
            heroImageMobile: d.settings.heroImageMobile || "",
            ctaLabel: d.settings.ctaLabel || "",
            ctaTarget: d.settings.ctaTarget || "",
            featuredSetIds: JSON.stringify(d.settings.featuredSetIds || []),
          });
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        featuredSetIds: JSON.parse(form.featuredSetIds || "[]"),
      }),
    });
    setSaving(false);
    if (res.ok) toast("Homepage settings saved");
    else toast.error("Failed to save");
  };

  return (
    <div className="max-w-[600px]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Homepage</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 h-10 px-6 bg-black text-white text-sm font-semibold rounded-[12px] disabled:opacity-50">
          <Save size={16} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>
      <div className="space-y-4">
        {[
          { label: "Hero image URL", field: "heroImage" },
          { label: "Hero image (mobile)", field: "heroImageMobile" },
          { label: "CTA label", field: "ctaLabel" },
          { label: "CTA target (URL)", field: "ctaTarget" },
        ].map(({ label, field }) => (
          <div key={field}>
            <label className="text-xs font-medium text-muted block mb-1">{label}</label>
            <input
              value={(form as unknown as Record<string, string>)[field]}
              onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
              className="w-full border border-[rgba(0,0,0,0.16)] rounded-[12px] p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
        ))}
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Featured set IDs (JSON array)</label>
          <textarea
            value={form.featuredSetIds}
            onChange={(e) => setForm((p) => ({ ...p, featuredSetIds: e.target.value }))}
            rows={3}
            className="w-full border border-[rgba(0,0,0,0.16)] rounded-[12px] p-3 text-xs font-mono focus:outline-none focus:border-black resize-none"
          />
        </div>
      </div>
    </div>
  );
}
