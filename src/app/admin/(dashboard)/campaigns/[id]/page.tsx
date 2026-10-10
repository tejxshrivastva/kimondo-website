"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface CampaignForm {
  title: string;
  slug: string;
  subtitle: string;
  body: string;
  location: string;
  date: string;
  credits: string;
  status: string;
}

export default function AdminCampaignEditor() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CampaignForm>({
    title: "",
    slug: "",
    subtitle: "",
    body: "",
    location: "",
    date: "",
    credits: "[]",
    status: "draft",
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/campaigns/${id}`).then((r) => r.json()).then((data) => {
        if (data.campaign) {
          setForm({
            title: data.campaign.title,
            slug: data.campaign.slug,
            subtitle: data.campaign.subtitle || "",
            body: data.campaign.body || "",
            location: data.campaign.location || "",
            date: data.campaign.date || "",
            credits: JSON.stringify(data.campaign.credits || []),
            status: data.campaign.status,
          });
        }
      });
    }
  }, [id, isNew]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(
      isNew ? "/api/admin/campaigns" : `/api/admin/campaigns/${id}`,
      {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, credits: JSON.parse(form.credits || "[]") }),
      }
    );
    setSaving(false);
    if (res.ok) {
      toast("Campaign saved");
      router.push("/admin/campaigns");
    } else {
      toast.error("Failed to save");
    }
  };

  const updateField = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  return (
    <div className="max-w-[1200px] px-[clamp(14px,3vw,34px)] py-[clamp(18px,3vw,30px)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light">{isNew ? "New campaign" : "Edit campaign"}</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 h-10 px-6 bg-black text-white text-sm font-semibold  disabled:opacity-50">
          <Save size={16} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>
      <div className="space-y-4">
        {[
          { label: "Title", field: "title" },
          { label: "Slug", field: "slug" },
          { label: "Subtitle", field: "subtitle" },
          { label: "Location", field: "location" },
          { label: "Date", field: "date" },
        ].map(({ label, field }) => (
          <div key={field}>
            <label className="text-xs font-medium text-muted block mb-1">{label}</label>
            <input
              value={(form as unknown as Record<string, string>)[field]}
              onChange={(e) => updateField(field, e.target.value)}
              className="w-full border border-[rgba(0,0,0,0.16)]  p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
        ))}
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Body</label>
          <textarea value={form.body} onChange={(e) => updateField("body", e.target.value)} rows={6} className="w-full border border-[rgba(0,0,0,0.16)]  p-3 text-sm focus:outline-none focus:border-black resize-none" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Status</label>
          <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className="w-full border border-[rgba(0,0,0,0.16)]  p-3 text-sm bg-white focus:outline-none focus:border-black">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Credits (JSON)</label>
          <textarea value={form.credits} onChange={(e) => updateField("credits", e.target.value)} rows={3} className="w-full border border-[rgba(0,0,0,0.16)]  p-3 text-xs font-mono focus:outline-none focus:border-black resize-none" />
        </div>
      </div>
    </div>
  );
}
