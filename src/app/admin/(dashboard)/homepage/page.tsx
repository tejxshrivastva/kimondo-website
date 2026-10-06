"use client";

import { useState, useEffect } from "react";
import { Save, X as XIcon, Plus } from "lucide-react";
import { toast } from "sonner";

interface HomepageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroImageMobile: string;
  heroVideo: string;
  ctaLabel: string;
  ctaTarget: string;
  featuredSetIds: string[];
}

interface SetOption {
  id: string;
  name: string;
  slug: string;
}

export default function AdminHomepagePage() {
  const [form, setForm] = useState<HomepageSettings>({
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    heroImageMobile: "",
    heroVideo: "",
    ctaLabel: "",
    ctaTarget: "",
    featuredSetIds: [],
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [allSets, setAllSets] = useState<SetOption[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/homepage").then((r) => r.json()),
      fetch("/api/admin/sets-list").then((r) => r.json()).catch(() => ({ sets: [] })),
    ]).then(([homepage, setsData]) => {
      if (homepage.settings) {
        setForm({
          heroTitle: homepage.settings.heroTitle || "",
          heroSubtitle: homepage.settings.heroSubtitle || "",
          heroImage: homepage.settings.heroImage || "",
          heroImageMobile: homepage.settings.heroImageMobile || "",
          heroVideo: homepage.settings.heroVideo || "",
          ctaLabel: homepage.settings.ctaLabel || "",
          ctaTarget: homepage.settings.ctaTarget || "",
          featuredSetIds: homepage.settings.featuredSetIds || [],
        });
      }
      setAllSets(setsData.sets || []);
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

  const addFeatured = (id: string) => {
    if (!id || form.featuredSetIds.includes(id)) return;
    setForm((p) => ({ ...p, featuredSetIds: [...p.featuredSetIds, id] }));
  };

  const removeFeatured = (id: string) => {
    setForm((p) => ({ ...p, featuredSetIds: p.featuredSetIds.filter((s) => s !== id) }));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) toast("Homepage settings saved");
    else toast.error("Failed to save");
  };

  const availableSets = allSets.filter((s) => !form.featuredSetIds.includes(s.id));

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
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-3">Hero text</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Headline</label>
              <input
                value={form.heroTitle}
                onChange={(e) => setForm((p) => ({ ...p, heroTitle: e.target.value }))}
                placeholder="e.g. Woven by hand"
                className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Subtext</label>
              <input
                value={form.heroSubtitle}
                onChange={(e) => setForm((p) => ({ ...p, heroSubtitle: e.target.value }))}
                placeholder="e.g. Each garment begins as raw yarn"
                className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-1">Hero media</h2>
          <p className="text-xs text-[#666666] mb-4">Upload a background video or image for the full-screen hero. Video takes priority over image.</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted block mb-2">Background video (MP4)</label>
              <label className="block cursor-pointer">
                {form.heroVideo ? (
                  <div className="relative aspect-video max-w-full overflow-hidden border border-[rgba(0,0,0,0.12)]">
                    <video src={form.heroVideo} className="w-full h-full object-cover" muted />
                    <button type="button" onClick={(e) => { e.preventDefault(); setForm((p) => ({ ...p, heroVideo: "" })); }} className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1">Remove</button>
                  </div>
                ) : (
                  <div className="aspect-video border border-dashed border-[rgba(0,0,0,0.2)] flex items-center justify-center hover:bg-[#f8f8f8] transition-colors">
                    <span className="text-sm text-[#666666]">{uploading === "heroVideo" ? "Uploading..." : "Click to upload video"}</span>
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
                    <button type="button" onClick={(e) => { e.preventDefault(); setForm((p) => ({ ...p, heroImage: "" })); }} className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1">Remove</button>
                  </div>
                ) : (
                  <div className="aspect-video border border-dashed border-[rgba(0,0,0,0.2)] flex items-center justify-center hover:bg-[#f8f8f8] transition-colors">
                    <span className="text-sm text-[#666666]">{uploading === "heroImage" ? "Uploading..." : "Click to upload image"}</span>
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
                    <button type="button" onClick={(e) => { e.preventDefault(); setForm((p) => ({ ...p, heroImageMobile: "" })); }} className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1">Remove</button>
                  </div>
                ) : (
                  <div className="aspect-[9/16] max-w-[200px] border border-dashed border-[rgba(0,0,0,0.2)] flex items-center justify-center hover:bg-[#f8f8f8] transition-colors">
                    <span className="text-sm text-[#666666] text-center px-2">{uploading === "heroImageMobile" ? "Uploading..." : "Click to upload"}</span>
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
              <input value={form.ctaLabel} onChange={(e) => setForm((p) => ({ ...p, ctaLabel: e.target.value }))} className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Button link</label>
              <input value={form.ctaTarget} onChange={(e) => setForm((p) => ({ ...p, ctaTarget: e.target.value }))} className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-3">Featured products</h2>
          <div className="space-y-2 mb-3">
            {form.featuredSetIds.map((id) => {
              const s = allSets.find((x) => x.id === id);
              return (
                <div key={id} className="flex items-center justify-between p-2 border border-[rgba(0,0,0,0.08)] text-sm">
                  <span>{s ? s.name : id}</span>
                  <button onClick={() => removeFeatured(id)} className="p-1 text-muted hover:text-black">
                    <XIcon size={14} />
                  </button>
                </div>
              );
            })}
          </div>
          {availableSets.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                id="add-featured"
                defaultValue=""
                onChange={(e) => { addFeatured(e.target.value); e.target.value = ""; }}
                className="flex-1 border border-[rgba(0,0,0,0.16)] p-2 text-sm bg-white focus:outline-none focus:border-black"
              >
                <option value="" disabled>Add a product...</option>
                {availableSets.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <Plus size={16} className="text-muted" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
