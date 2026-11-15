"use client";

import { useState } from "react";
import { WishlistItem } from "@/lib/types";
import { APP_CONFIG } from "@/lib/config";
import { X, Save } from "lucide-react";

interface EditItemModalProps {
  item: WishlistItem;
  slug: string;
  secretKey: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditItemModal({
  item,
  slug,
  secretKey,
  onClose,
  onSuccess,
}: EditItemModalProps) {
  const [title, setTitle] = useState(item.title);
  const [price, setPrice] = useState(item.price.toString());
  const [productUrl, setProductUrl] = useState(item.productUrl || "");
  const [imageUrl, setImageUrl] = useState(item.imageUrl || "");
  const [emoji, setEmoji] = useState(item.emoji || "🎁");
  const [priority, setPriority] = useState<"must_have" | "nice_to_have">(item.priority);
  const [allowOverfunding, setAllowOverfunding] = useState(item.allowOverfunding);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = Number(price);
    if (!numPrice || numPrice <= 0) {
      setError("Please enter a valid price in INR");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/pools/${slug}/items/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-owner-key": secretKey,
        },
        body: JSON.stringify({
          title: title.trim(),
          price: numPrice,
          productUrl: productUrl.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
          emoji,
          priority,
          allowOverfunding,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update item");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to update item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white neo-box p-6 my-8 animate-pop">
        <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
          <h2 className="font-black text-xl text-black">Edit Wishlist Item ✏️</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border-2 border-black hover:bg-gray-100 transition shadow-[2px_2px_0px_#000]"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-100 border-2 border-black rounded-xl text-xs font-bold text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-black mb-1">Item Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-black mb-1">Target Price (INR)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-black text-sm text-gray-500">₹</span>
              <input
                type="number"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-7 pr-3 py-2 border-2 border-black rounded-lg text-sm font-black text-black focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-black mb-1.5">Cover Emoji</label>
            <div className="flex flex-wrap gap-2">
              {APP_CONFIG.defaultEmojis.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 text-xl flex items-center justify-center rounded-lg border-2 border-black transition ${
                    emoji === e ? "bg-secondary shadow-[2px_2px_0px_#000] scale-110" : "bg-gray-100"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-black mb-1">Image URL (Optional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-black mb-1">Product Link (Optional)</label>
            <input
              type="url"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-black mb-1.5">Priority</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPriority("must_have")}
                className={`py-2 px-3 text-xs font-black rounded-lg border-2 border-black transition ${
                  priority === "must_have"
                    ? "bg-rose-300 text-black shadow-[2px_2px_0px_#000]"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                🔥 Must Have
              </button>
              <button
                type="button"
                onClick={() => setPriority("nice_to_have")}
                className={`py-2 px-3 text-xs font-black rounded-lg border-2 border-black transition ${
                  priority === "nice_to_have"
                    ? "bg-sky-200 text-black shadow-[2px_2px_0px_#000]"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                ✨ Nice to Have
              </button>
            </div>
          </div>

          <div className="p-3 bg-yellow-50 border-2 border-black rounded-xl">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={allowOverfunding}
                onChange={(e) => setAllowOverfunding(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-black text-primary accent-primary"
              />
              <span className="text-xs font-black text-black">Allow Overfunding buffer (+10%)</span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="neo-btn w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-black flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000]"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
