"use client";

import { useState } from "react";
import { BirthdayPool } from "@/lib/types";
import { THEME_PRESETS } from "@/lib/themes";
import { X, Save, Lock, Unlock } from "lucide-react";

interface EditPoolModalProps {
  pool: BirthdayPool;
  secretKey: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditPoolModal({
  pool,
  secretKey,
  onClose,
  onSuccess,
}: EditPoolModalProps) {
  const [name, setName] = useState(pool.name);
  const [birthdayDate, setBirthdayDate] = useState(pool.birthdayDate);
  const [upiId, setUpiId] = useState(pool.upiId);
  const [message, setMessage] = useState(pool.message || "");
  const [themeId, setThemeId] = useState(pool.themeId || "hyperpop");
  const [customAccent, setCustomAccent] = useState(pool.customAccent || "");
  const [isClosed, setIsClosed] = useState(pool.isClosed);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/pools/${pool.slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-owner-key": secretKey,
        },
        body: JSON.stringify({
          name: name.trim(),
          birthdayDate,
          upiId: upiId.trim(),
          message: message.trim(),
          themeId,
          customAccent: customAccent ? customAccent : undefined,
          isClosed,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update pool settings");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to update pool");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white neo-box p-6 my-8 animate-pop">
        <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
          <h2 className="font-black text-xl text-black">Pool Settings ⚙️</h2>
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
            <label className="block text-xs font-black text-black mb-1">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-black mb-1">Birthday Date</label>
            <input
              type="date"
              required
              value={birthdayDate}
              onChange={(e) => setBirthdayDate(e.target.value)}
              className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-black mb-1">UPI ID (VPA)</label>
            <input
              type="text"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-black mb-1">Bio / Hype Note</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Theme Preset Selector */}
          <div>
            <label className="block text-xs font-black text-black mb-1.5">Theme Preset</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(THEME_PRESETS).map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setThemeId(t.id)}
                  className={`p-2 rounded-xl border-2 border-black text-left flex items-center gap-2 transition ${
                    themeId === t.id
                      ? "bg-secondary shadow-[2px_2px_0px_#000] scale-[1.02]"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-xl">{t.badge}</span>
                  <div>
                    <span className="text-xs font-black block text-black">{t.name}</span>
                    <span className="text-[10px] text-gray-600 block line-clamp-1">{t.tagline}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Accent Color Picker */}
          <div>
            <label className="block text-xs font-black text-black mb-1">
              Custom Accent Color (Optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customAccent || "#FF2E93"}
                onChange={(e) => setCustomAccent(e.target.value)}
                className="w-10 h-10 rounded border-2 border-black cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-gray-700">
                {customAccent || "Default for theme"}
              </span>
              {customAccent && (
                <button
                  type="button"
                  onClick={() => setCustomAccent("")}
                  className="text-xs text-rose-600 font-bold underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Close / Reopen Pool */}
          <div className="p-3 bg-muted rounded-xl border-2 border-black">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isClosed}
                onChange={(e) => setIsClosed(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-black text-rose-600 accent-rose-600"
              />
              <div>
                <span className="text-xs font-black text-black flex items-center gap-1">
                  {isClosed ? <Lock className="w-3.5 h-3.5 text-rose-600" /> : <Unlock className="w-3.5 h-3.5" />}
                  {isClosed ? "Pool is Closed" : "Close Pool (Stop all new contributions)"}
                </span>
                <span className="text-[11px] font-bold text-gray-600">
                  You can reopen it anytime.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="neo-btn w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-black flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000]"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? "Updating..." : "Save Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
