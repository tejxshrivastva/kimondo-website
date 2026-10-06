"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface HomepageSettings {
  heroImage: string;
  heroImageMobile: string;
  heroVideo: string;
  ctaLabel: string;
  ctaTarget: string;
  featuredSetIds: string;
}

export default function AdminHomepagePage() {
  const [form, setForm] = useState<HomepageSettings>({
    heroImage: "",
    heroImageMobile: "",
    heroVideo: "",
    ctaLabel: "",
    ctaTarget: "",
    featuredSetIds: "[]",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          setForm({
            heroImage: d.settings.heroImage || "",
            heroImageMobile: d.settings.heroImageMobile || "",
            heroVideo: d.settings.heroVideo || "",
            ctaLabel: d.settings.ctaLabel || "",
            ctaTarget: d.settings.ctaTarget || "",
            featuredSetIds: JSON.stringify(d.settings.featuredSetIds || []),
          });
        }
      });
  }, []);

  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  };

  const handleUpload = async (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    const url = await uploadFile(file);
    if (url) setForm((p) => ({ ...p, [field]: url }));
    setUploading(null);
  };

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
    <div className="max-w-[600px] px-[clamp(14px,3vw,34px)] py-[clamp(18px,3vw,30px)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Homepage</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 h-10 px-6 bg-black text-white text-sm font-semibold disabled:opacity-50">
          <Save size={16} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>
      <div className="space-y-6">
        <section>
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-1">Hero section</h2>
          <p className="text-xs text-[#666666] mb-4">Upload a background video or image for the full-screen hero. Video takes priority over image.</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted block mb-2">Background video (MP4)</label>
              <label className="block cursor-pointer">
                {form.heroVideo ? (
                  <div className="relative aspect-video max-w-full overflow-hidden border border-[rgba(0,0,0,0.12)]">
                    <video src={form.heroVideo} className="w-full h-full object-cover" muted />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setForm((p) => ({ ...p, heroVideo: "" })); }}
                      className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="aspect-video border border-dashed border-[rgba(0,0,0,0.2)] flex items-center justify-center hover:bg-[#f8f8f8] transition-colors">
                    <span className="text-sm text-[#666666]">
                      {uploading === "heroVideo" ? "Uploading..." : "Click to upload video"}
                    </span>
                  </div>
                )}
                <input type="file" accept="video/*" className="hidden" onChange={(e) => handleUpload("heroVideo", e)} />
              </label>
            </div>

            <div>
              <label className="text-xs font-medium text-muted block mb-2">Background image (desktop fallback)</label>
              <label className="block cursor-pointer">
                {form.heroImage ? (
                  <div className="relative aspect-video max-w-full overflow-hidden border border-[rgba(0,0,0,0.12)]">
                    <img src={form.heroImage} alt="Hero" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setForm((p) => ({ ...p, heroImage: "" })); }}
                      className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="aspect-video border border-dashed border-[rgba(0,0,0,0.2)] flex items-center justify-center hover:bg-[#f8f8f8] transition-colors">
                    <span className="text-sm text-[#666666]">
                      {uploading === "heroImage" ? "Uploading..." : "Click to upload image"}
                    </span>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload("heroImage", e)} />
              </label>
            </div>

            <div>
              <label className="text-xs font-medium text-muted block mb-2">Background image (mobile)</label>
              <label className="block cursor-pointer">
                {form.heroImageMobile ? (
                  <div className="relative aspect-[9/16] max-w-[200px] overflow-hidden border border-[rgba(0,0,0,0.12)]">
                    <img src={form.heroImageMobile} alt="Hero mobile" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setForm((p) => ({ ...p, heroImageMobile: "" })); }}
                      className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="aspect-[9/16] max-w-[200px] border border-dashed border-[rgba(0,0,0,0.2)] flex items-center justify-center hover:bg-[#f8f8f8] transition-colors">
                    <span className="text-sm text-[#666666] text-center px-2">
                      {uploading === "heroImageMobile" ? "Uploading..." : "Click to upload"}
                    </span>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload("heroImageMobile", e)} />
              </label>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-3">Call to action</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Button label</label>
              <input
                value={form.ctaLabel}
                onChange={(e) => setForm((p) => ({ ...p, ctaLabel: e.target.value }))}
                className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Button link</label>
              <input
                value={form.ctaTarget}
                onChange={(e) => setForm((p) => ({ ...p, ctaTarget: e.target.value }))}
                className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-3">Featured products</h2>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Product IDs (JSON array)</label>
            <textarea
              value={form.featuredSetIds}
              onChange={(e) => setForm((p) => ({ ...p, featuredSetIds: e.target.value }))}
              rows={3}
              className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-xs font-mono focus:outline-none focus:border-black resize-none"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
