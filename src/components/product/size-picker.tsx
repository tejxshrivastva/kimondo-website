"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import useSWR from "swr";
import { useOverlayStore } from "@/store/overlay-store";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface SetData {
  id: string;
  name: string;
  slug: string;
  items: {
    id: string;
    name: string;
    category: string;
    price: number;
    variants: { id: string; size: string; stock: number }[];
  }[];
}

export function SizePicker() {
  const {
    pickerOpen,
    pickerSetSlug,
    pickerItemId,
    pickerMode,
    closePicker,
    openNotify,
  } = useOverlayStore();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [catSizes, setCatSizes] = useState<Record<string, string>>({});

  const { data: setData } = useSWR<SetData>(
    pickerOpen && pickerSetSlug
      ? `/api/sets/${pickerSetSlug}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (!pickerOpen) {
      setSelectedSize(null);
      setCheckedItems({});
      setCatSizes({});
    }
  }, [pickerOpen]);

  useEffect(() => {
    if (setData && pickerMode === "set") {
      const checked: Record<string, boolean> = {};
      setData.items.forEach((item) => {
        checked[item.id] = true;
      });
      setCheckedItems(checked);
    }
  }, [setData, pickerMode]);

  if (!pickerOpen || !pickerSetSlug) return null;

  const item =
    pickerMode === "item" && setData
      ? setData.items.find((i) => i.id === pickerItemId)
      : null;

  const handleAddItem = async () => {
    if (!item || !selectedSize || !setData) return;
    const variant = item.variants.find((v) => v.size === selectedSize);
    if (!variant) return;
    const success = await addItem(variant.id, setData.id, item.name);
    if (success) closePicker();
  };

  const handleAddSet = async () => {
    if (!setData) return;
    let addedAny = false;
    for (const item of setData.items) {
      if (!checkedItems[item.id]) continue;
      const sizeKey = item.category;
      const selectedSizeForCat = catSizes[sizeKey];
      if (!selectedSizeForCat && item.category !== "accessory") continue;

      let variant;
      if (item.category === "accessory") {
        variant = item.variants[0];
      } else {
        variant = item.variants.find((v) => v.size === selectedSizeForCat);
      }
      if (!variant || variant.stock < 1) continue;
      await addItem(variant.id, setData.id, item.name);
      addedAny = true;
    }
    if (addedAny) closePicker();
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[75]" onClick={closePicker} />

      <div className="fixed bottom-0 left-0 right-0 max-w-[460px] mx-auto bg-white z-[75] animate-slide-up max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[rgba(0,0,0,0.1)]">
          <div>
            {setData && (
              <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-muted">
                {setData.name}
              </p>
            )}
            <h3 className="font-display text-lg">
              {pickerMode === "item" && item
                ? item.name
                : `Build your ${setData?.name || ""} set`}
            </h3>
          </div>
          <button onClick={closePicker} className="p-2">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {pickerMode === "item" && item && (
            <div className="space-y-4">
              <p className="text-sm">{formatPrice(item.price)}</p>
              <div className="flex flex-wrap gap-2">
                {item.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      if (v.stock < 1) {
                        openNotify(v.id);
                        return;
                      }
                      setSelectedSize(v.size);
                    }}
                    className={`min-w-[48px] h-10 px-3  text-sm font-medium border transition-colors ${
                      v.stock < 1
                        ? "border-[rgba(0,0,0,0.1)] text-muted line-through cursor-pointer"
                        : selectedSize === v.size
                          ? "bg-black text-white border-black"
                          : "border-[rgba(0,0,0,0.24)] hover:border-black"
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
              <button
                onClick={handleAddItem}
                disabled={!selectedSize}
                className="w-full h-12 bg-black text-white text-sm font-semibold  hover:bg-black/90 transition-colors disabled:opacity-50"
              >
                Add to cart
              </button>
            </div>
          )}

          {pickerMode === "set" && setData && (
            <div className="space-y-4">
              {setData.items.map((item) => {
                const isAccessory = item.category === "accessory";
                return (
                  <div
                    key={item.id}
                    className="p-3 border border-[rgba(0,0,0,0.1)] "
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checkedItems[item.id] || false}
                        onChange={(e) =>
                          setCheckedItems((prev) => ({
                            ...prev,
                            [item.id]: e.target.checked,
                          }))
                        }
                        className="w-5 h-5 rounded accent-black"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium">
                          {item.name}
                        </span>
                        <span className="text-xs text-muted ml-2 capitalize">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-sm">
                        {formatPrice(item.price)}
                      </span>
                    </label>
                    {checkedItems[item.id] && !isAccessory && (
                      <div className="flex flex-wrap gap-2 mt-3 ml-8">
                        {item.variants.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => {
                              if (v.stock < 1) {
                                openNotify(v.id);
                                return;
                              }
                              setCatSizes((prev) => ({
                                ...prev,
                                [item.category]: v.size,
                              }));
                            }}
                            className={`min-w-[40px] h-8 px-2  text-xs font-medium border transition-colors ${
                              v.stock < 1
                                ? "border-[rgba(0,0,0,0.1)] text-muted line-through"
                                : catSizes[item.category] === v.size
                                  ? "bg-black text-white border-black"
                                  : "border-[rgba(0,0,0,0.24)] hover:border-black"
                            }`}
                          >
                            {v.size}
                          </button>
                        ))}
                      </div>
                    )}
                    {checkedItems[item.id] && isAccessory && (
                      <p className="text-xs text-muted mt-2 ml-8">
                        One size
                      </p>
                    )}
                  </div>
                );
              })}
              <button
                onClick={handleAddSet}
                disabled={checkedCount === 0}
                className="w-full h-12 bg-black text-white text-sm font-semibold  hover:bg-black/90 transition-colors disabled:opacity-50"
              >
                Add {checkedCount} {checkedCount === 1 ? "item" : "items"} to
                cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
