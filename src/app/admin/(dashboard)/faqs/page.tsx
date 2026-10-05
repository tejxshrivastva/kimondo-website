"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface Faq {
  id: string;
  question: string;
  answer: string;
  section: string;
  sortOrder: number;
}

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/faqs").then((r) => r.json()).then((d) => setFaqs(d.faqs || []));
  }, []);

  const addFaq = () =>
    setFaqs((p) => [
      ...p,
      { id: `new-${Date.now()}`, question: "", answer: "", section: "General", sortOrder: p.length },
    ]);

  const updateFaq = (idx: number, field: string, value: string) =>
    setFaqs((p) => p.map((f, i) => (i === idx ? { ...f, [field]: value } : f)));

  const removeFaq = (idx: number) =>
    setFaqs((p) => p.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/faqs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ faqs }),
    });
    setSaving(false);
    if (res.ok) toast("FAQs saved");
    else toast.error("Failed to save");
  };

  return (
    <div className="max-w-[700px]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">FAQ</h1>
        <div className="flex gap-2">
          <button onClick={addFaq} className="flex items-center gap-1 h-10 px-4 border border-[rgba(0,0,0,0.16)] text-sm font-medium rounded-[12px]">
            <Plus size={16} /> Add
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 h-10 px-6 bg-black text-white text-sm font-semibold rounded-[12px] disabled:opacity-50">
            <Save size={16} /> {saving ? "Saving..." : "Save all"}
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={faq.id} className="border border-[rgba(0,0,0,0.12)] rounded-[12px] p-4">
            <div className="flex items-start gap-2">
              <GripVertical size={16} className="text-muted mt-3 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <input
                  value={faq.question}
                  onChange={(e) => updateFaq(idx, "question", e.target.value)}
                  placeholder="Question"
                  className="w-full border border-[rgba(0,0,0,0.12)] rounded-lg p-2 text-sm font-medium focus:outline-none focus:border-black"
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                  placeholder="Answer"
                  rows={2}
                  className="w-full border border-[rgba(0,0,0,0.12)] rounded-lg p-2 text-sm focus:outline-none focus:border-black resize-none"
                />
                <input
                  value={faq.section}
                  onChange={(e) => updateFaq(idx, "section", e.target.value)}
                  placeholder="Section"
                  className="w-40 border border-[rgba(0,0,0,0.12)] rounded-lg p-2 text-xs focus:outline-none focus:border-black"
                />
              </div>
              <button onClick={() => removeFaq(idx)} className="p-2 text-muted hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
