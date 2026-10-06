"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface Variant {
  id?: string;
  size: string;
  sku: string;
  stock: number;
}

interface Item {
  id?: string;
  name: string;
  category: string;
  price: number;
  image: string | null;
  sortOrder: number;
  variants: Variant[];
}

interface SetData {
  id?: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  productDetails: string | null;
  careInstructions: string | null;
  coverImage: string;
  images: string;
  status: string;
  toneFrom: string;
  toneTo: string;
  campaignId: string | null;
  badgeId: string | null;
  items: Item[];
}

interface Campaign { id: string; title: string }
interface Badge { id: string; name: string }

export function SetEditor({
  set,
  campaigns,
  badges,
}: {
  set: SetData | null;
  campaigns: Campaign[];
  badges: Badge[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SetData>(
    set || {
      name: "",
      slug: "",
      tagline: "",
      description: "",
      productDetails: "",
      careInstructions: "",
      coverImage: "",
      images: "[]",
      status: "draft",
      toneFrom: "#e8d5b7",
      toneTo: "#c4a882",
      campaignId: null,
      badgeId: null,
      items: [],
    }
  );

  const updateField = (field: string, value: string | null) =>
    setForm((p) => ({ ...p, [field]: value }));

  const [uploading, setUploading] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("cover");
    const url = await uploadFile(file);
    if (url) updateField("coverImage", url);
    setUploading(null);
  };

  const getSliderImages = (): string[] => {
    try { return JSON.parse(form.images || "[]"); } catch { return []; }
  };

  const handleSliderUpload = async (slotIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(`slider-${slotIdx}`);
    const url = await uploadFile(file);
    if (url) {
      const imgs = getSliderImages();
      while (imgs.length <= slotIdx) imgs.push("");
      imgs[slotIdx] = url;
      updateField("images", JSON.stringify(imgs));
    }
    setUploading(null);
  };

  const removeSliderImage = (slotIdx: number) => {
    const imgs = getSliderImages();
    imgs[slotIdx] = "";
    updateField("images", JSON.stringify(imgs.filter(Boolean).length > 0 ? imgs : []));
  };

  const handleItemImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(`item-${idx}`);
    const url = await uploadFile(file);
    if (url) updateItem(idx, "image", url);
    setUploading(null);
  };

  const addItem = () =>
    setForm((p) => ({
      ...p,
      items: [
        ...p.items,
        {
          name: "",
          category: "top",
          price: 0,
          image: null,
          sortOrder: p.items.length,
          variants: [],
        },
      ],
    }));

  const updateItem = (idx: number, field: string, value: string | number) =>
    setForm((p) => ({
      ...p,
      items: p.items.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      ),
    }));

  const removeItem = (idx: number) =>
    setForm((p) => ({
      ...p,
      items: p.items.filter((_, i) => i !== idx),
    }));

  const addVariant = (itemIdx: number) =>
    setForm((p) => ({
      ...p,
      items: p.items.map((item, i) =>
        i === itemIdx
          ? { ...item, variants: [...item.variants, { size: "M", sku: "", stock: 10 }] }
          : item
      ),
    }));

  const updateVariant = (
    itemIdx: number,
    varIdx: number,
    field: string,
    value: string | number
  ) =>
    setForm((p) => ({
      ...p,
      items: p.items.map((item, i) =>
        i === itemIdx
          ? {
              ...item,
              variants: item.variants.map((v, vi) =>
                vi === varIdx ? { ...v, [field]: value } : v
              ),
            }
          : item
      ),
    }));

  const removeVariant = (itemIdx: number, varIdx: number) =>
    setForm((p) => ({
      ...p,
      items: p.items.map((item, i) =>
        i === itemIdx
          ? { ...item, variants: item.variants.filter((_, vi) => vi !== varIdx) }
          : item
      ),
    }));

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(
      form.id ? `/api/admin/sets/${form.id}` : "/api/admin/sets",
      {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    setSaving(false);
    if (res.ok) {
      toast("Set saved");
      router.push("/admin/sets");
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to save");
    }
  };

  return (
    <div className="max-w-[800px] px-[clamp(14px,3vw,34px)] py-[clamp(18px,3vw,30px)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">
          {form.id ? `Edit: ${form.name}` : "New product"}
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 h-10 px-6 bg-black text-white text-sm font-semibold disabled:opacity-50"
        >
          <Save size={16} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Cover image */}
        <section>
          <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-1">Product images</h2>
          <p className="text-xs text-[#666666] mb-3">The cover image appears on the store grid. Each item below has its own image slot for the product page slider.</p>
          <label className="text-xs font-medium text-muted block mb-2">Cover image</label>
          <label className="block cursor-pointer">
            {form.coverImage ? (
              <div className="relative aspect-[4/5] max-w-[300px] overflow-hidden border border-[rgba(0,0,0,0.12)]">
                <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); updateField("coverImage", ""); }}
                  className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="aspect-[4/5] max-w-[300px] border border-dashed border-[rgba(0,0,0,0.2)] flex items-center justify-center hover:bg-[#f8f8f8] transition-colors">
                <span className="text-sm text-[#666666]">
                  {uploading === "cover" ? "Uploading..." : "Cover image (click to upload)"}
                </span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </label>

          <label className="text-xs font-medium text-muted block mb-2 mt-4">Slider images (product detail page)</label>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((slotIdx) => {
              const imgs = getSliderImages();
              const imgUrl = imgs[slotIdx] || "";
              return (
                <label key={slotIdx} className="block cursor-pointer">
                  {imgUrl ? (
                    <div className="relative aspect-[4/5] overflow-hidden border border-[rgba(0,0,0,0.12)]">
                      <img src={imgUrl} alt={`Slider ${slotIdx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); removeSliderImage(slotIdx); }}
                        className="absolute top-1 right-1 bg-black text-white text-[10px] px-1.5 py-0.5"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-[4/5] border border-dashed border-[rgba(0,0,0,0.2)] flex items-center justify-center hover:bg-[#f8f8f8] transition-colors">
                      <span className="text-[10px] text-[#666666] text-center px-1">
                        {uploading === `slider-${slotIdx}` ? "Uploading..." : `Image ${slotIdx + 1}`}
                      </span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSliderUpload(slotIdx, e)} />
                </label>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <h2 className="col-span-2 text-sm font-semibold tracking-[0.1em] uppercase">Product details</h2>
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted block mb-1">Product name</label>
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm bg-white focus:outline-none focus:border-black"
            >
              <option value="draft">Draft</option>
              <option value="live">Live</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted block mb-1">Tagline</label>
            <input
              value={form.tagline || ""}
              onChange={(e) => updateField("tagline", e.target.value)}
              className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted block mb-1">Description</label>
            <textarea
              value={form.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Tone from</label>
            <input
              type="color"
              value={form.toneFrom}
              onChange={(e) => updateField("toneFrom", e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Tone to</label>
            <input
              type="color"
              value={form.toneTo}
              onChange={(e) => updateField("toneTo", e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Campaign</label>
            <select
              value={form.campaignId || ""}
              onChange={(e) => updateField("campaignId", e.target.value || null)}
              className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm bg-white focus:outline-none focus:border-black"
            >
              <option value="">None</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Badge</label>
            <select
              value={form.badgeId || ""}
              onChange={(e) => updateField("badgeId", e.target.value || null)}
              className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm bg-white focus:outline-none focus:border-black"
            >
              <option value="">None</option>
              {badges.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted block mb-1">Product details</label>
            <textarea
              value={form.productDetails || ""}
              onChange={(e) => updateField("productDetails", e.target.value)}
              rows={3}
              className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black resize-none"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted block mb-1">Care instructions</label>
            <textarea
              value={form.careInstructions || ""}
              onChange={(e) => updateField("careInstructions", e.target.value)}
              rows={3}
              className="w-full border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black resize-none"
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold tracking-[0.1em] uppercase">
              Items ({form.items.length})
            </h2>
            <button
              onClick={addItem}
              className="flex items-center gap-1 text-xs font-medium hover:underline"
            >
              <Plus size={14} /> Add item
            </button>
          </div>

          <div className="space-y-4">
            {form.items.map((item, idx) => (
              <div
                key={idx}
                className="border border-[rgba(0,0,0,0.12)] p-4"
              >
                {/* Item image */}
                <label className="block cursor-pointer mb-3">
                  {item.image ? (
                    <div className="relative aspect-[4/5] max-w-[160px] overflow-hidden border border-[rgba(0,0,0,0.12)]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); updateItem(idx, "image", ""); }}
                        className="absolute top-1 right-1 bg-black text-white text-[10px] px-1.5 py-0.5"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-[4/5] max-w-[160px] border border-dashed border-[rgba(0,0,0,0.2)] flex items-center justify-center hover:bg-[#f8f8f8] transition-colors">
                      <span className="text-xs text-[#666666] text-center px-2">
                        {uploading === `item-${idx}` ? "Uploading..." : "Item image (click to upload)"}
                      </span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleItemImageUpload(idx, e)} />
                </label>

                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <input
                      value={item.name}
                      onChange={(e) => updateItem(idx, "name", e.target.value)}
                      placeholder="Item name"
                      className="border border-[rgba(0,0,0,0.16)] p-2 text-sm focus:outline-none focus:border-black"
                    />
                    <select
                      value={item.category}
                      onChange={(e) => updateItem(idx, "category", e.target.value)}
                      className="border border-[rgba(0,0,0,0.16)] p-2 text-sm bg-white focus:outline-none focus:border-black"
                    >
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="accessory">Accessory</option>
                    </select>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(idx, "price", Number(e.target.value))}
                      placeholder="Price (paise)"
                      className="border border-[rgba(0,0,0,0.16)] p-2 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <button
                    onClick={() => removeItem(idx)}
                    className="p-2 text-muted hover:text-black"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="ml-4 space-y-2">
                  <p className="text-xs text-muted">Variants:</p>
                  {item.variants.map((v, vi) => (
                    <div key={vi} className="flex items-center gap-2">
                      <input
                        value={v.size}
                        onChange={(e) => updateVariant(idx, vi, "size", e.target.value)}
                        placeholder="Size"
                        className="w-20 border border-[rgba(0,0,0,0.12)] p-1.5 text-xs focus:outline-none focus:border-black"
                      />
                      <input
                        value={v.sku}
                        onChange={(e) => updateVariant(idx, vi, "sku", e.target.value)}
                        placeholder="SKU"
                        className="w-28 border border-[rgba(0,0,0,0.12)] p-1.5 text-xs focus:outline-none focus:border-black"
                      />
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => updateVariant(idx, vi, "stock", Number(e.target.value))}
                        placeholder="Stock"
                        className="w-20 border border-[rgba(0,0,0,0.12)] p-1.5 text-xs focus:outline-none focus:border-black"
                      />
                      <button
                        onClick={() => removeVariant(idx, vi)}
                        className="p-1 text-muted hover:text-black"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addVariant(idx)}
                    className="text-xs font-medium text-muted hover:text-black"
                  >
                    + Add variant
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
