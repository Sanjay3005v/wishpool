"use client";

import { useState } from "react";
import { COPY } from "@/lib/copy";
import { APP_CONFIG } from "@/lib/config";
import { X, Plus, Sparkles } from "lucide-react";

interface AddItemModalProps {
  slug: string;
  secretKey: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddItemModal({ slug, secretKey, onClose, onSuccess }: AddItemModalProps) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [emoji, setEmoji] = useState("🎁");
  const [priority, setPriority] = useState<"must_have" | "nice_to_have">("must_have");
  const [allowOverfunding, setAllowOverfunding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please give your wishlist item a name!");
      return;
    }
    const numPrice = Number(price);
    if (!numPrice || numPrice <= 0) {
      setError("Please enter a valid price in INR (e.g. 1999)");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/pools/${slug}/items`, {
        method: "POST",
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
        throw new Error(data.error || "Failed to add item");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to add item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white neo-box p-6 my-8 animate-pop">
        <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <h2 className="font-black text-xl text-black">{COPY.addItemModal.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border-2 border-black hover:bg-gray-100 transition shadow-[2px_2px_0px_#000]"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-100 border-2 border-black rounded-xl text-xs font-bold text-rose-800 shadow-[2px_2px_0px_#000]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-black text-black mb-1">
              {COPY.addItemModal.titleLabel} *
            </label>
            <input
              type="text"
              required
              placeholder={COPY.addItemModal.titlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-black text-black mb-1">
              {COPY.addItemModal.priceLabel} *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-black text-sm text-gray-500">₹</span>
              <input
                type="number"
                min="1"
                required
                placeholder={COPY.addItemModal.pricePlaceholder}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-7 pr-3 py-2 border-2 border-black rounded-lg text-sm font-black text-black focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Emoji cover picker */}
          <div>
            <label className="block text-xs font-black text-black mb-1.5">
              {COPY.addItemModal.emojiLabel}
            </label>
            <div className="flex flex-wrap gap-2">
              {APP_CONFIG.defaultEmojis.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 text-xl flex items-center justify-center rounded-lg border-2 border-black transition ${
                    emoji === e
                      ? "bg-secondary shadow-[2px_2px_0px_#000] scale-110"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Image URL (Optional) */}
          <div>
            <label className="block text-xs font-black text-black mb-1">
              {COPY.addItemModal.imageLabel}
            </label>
            <input
              type="url"
              placeholder={COPY.addItemModal.imagePlaceholder}
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-[11px] font-bold text-gray-500 mt-1">
              Leave empty to display the chosen big emoji!
            </p>
          </div>

          {/* Product link (Optional) */}
          <div>
            <label className="block text-xs font-black text-black mb-1">
              {COPY.addItemModal.urlLabel}
            </label>
            <input
              type="url"
              placeholder={COPY.addItemModal.urlPlaceholder}
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Priority Toggle */}
          <div>
            <label className="block text-xs font-black text-black mb-1.5">
              {COPY.addItemModal.priorityLabel}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPriority("must_have")}
                className={`py-2 px-3 text-xs font-black rounded-lg border-2 border-black transition ${
                  priority === "must_have"
                    ? "bg-rose-300 text-black shadow-[2px_2px_0px_#000]"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                ✨ Nice to Have
              </button>
            </div>
          </div>

          {/* Overfunding buffer toggle */}
          <div className="p-3 bg-yellow-50 border-2 border-black rounded-xl">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={allowOverfunding}
                onChange={(e) => setAllowOverfunding(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-black text-primary focus:ring-primary accent-primary"
              />
              <div>
                <span className="text-xs font-black text-black block">
                  {COPY.addItemModal.overfundingLabel}
                </span>
                <span className="text-[11px] font-bold text-gray-600">
                  Allows friends to keep tipping a little extra for shipping/taxes
                </span>
              </div>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="neo-btn w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-black flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000]"
            >
              <Plus className="w-5 h-5" />
              <span>{isSubmitting ? "Adding Gift..." : COPY.addItemModal.submit}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
