"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { COPY } from "@/lib/copy";
import { APP_CONFIG } from "@/lib/config";
import { THEME_PRESETS, ThemePreset } from "@/lib/themes";
import { fireConfetti } from "@/components/Confetti";
import {
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Key,
  Share2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

export default function CreatePoolPage() {
  const [name, setName] = useState("");
  const [birthdayDate, setBirthdayDate] = useState("");
  const [upiId, setUpiId] = useState("");
  const [message, setMessage] = useState("");
  const [avatarEmoji, setAvatarEmoji] = useState("🎂");
  const [themeId, setThemeId] = useState("hyperpop");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success State
  const [createdResult, setCreatedResult] = useState<{
    slug: string;
    secretKey: string;
  } | null>(null);

  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedOwner, setCopiedOwner] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name!");
      return;
    }
    if (!birthdayDate) {
      setError("Please select your birthday date!");
      return;
    }
    if (!upiId.trim() || !upiId.includes("@")) {
      setError("Please enter a valid UPI ID (e.g. name@bank or 9876543210@paytm)");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/pools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          birthdayDate,
          upiId: upiId.trim(),
          message: message.trim(),
          avatarEmoji,
          themeId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create pool");
      }

      fireConfetti();
      setCreatedResult({
        slug: data.slug,
        secretKey: data.secretKey,
      });

      // Save secret key in localStorage as a backup
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`wishpool_key_${data.slug}`, data.secretKey);
        } catch (_) {}
      }
    } catch (err: any) {
      setError(err.message || "Failed to create pool. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyText = (text: string, type: "public" | "owner") => {
    navigator.clipboard.writeText(text);
    if (type === "public") {
      setCopiedPublic(true);
      setTimeout(() => setCopiedPublic(false), 2000);
    } else {
      setCopiedOwner(true);
      setTimeout(() => setCopiedOwner(false), 2000);
    }
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const publicShareUrl = createdResult ? `${origin}/b/${createdResult.slug}` : "";
  const ownerManageUrl = createdResult
    ? `${origin}/b/${createdResult.slug}?key=${createdResult.secretKey}`
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF0F5] bg-dots">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 md:py-12 w-full">
        {createdResult ? (
          /* SUCCESS SCREEN */
          <div className="neo-box bg-white p-6 sm:p-8 space-y-6 shadow-neo-xl animate-pop">
            <div className="text-center space-y-2">
              <span className="text-5xl block animate-bounce">🎉</span>
              <h1 className="text-3xl font-black text-black tracking-tight">
                {COPY.createdSuccess.title}
              </h1>
              <p className="text-sm font-bold text-gray-700">
                {COPY.createdSuccess.subtitle}
              </p>
            </div>

            {/* Squad Share Link */}
            <div className="p-4 bg-muted/50 rounded-xl border-3 border-black space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-primary" />
                  {COPY.createdSuccess.publicLinkLabel}
                </span>
                <span className="text-[10px] font-bold bg-secondary px-2 py-0.5 rounded border border-black">
                  Public
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicShareUrl}
                  className="w-full text-xs font-mono font-bold bg-white border-2 border-black rounded-lg px-3 py-2 text-black select-all"
                />
                <button
                  onClick={() => copyText(publicShareUrl, "public")}
                  className="neo-btn bg-secondary text-black px-4 py-2 text-xs font-black flex items-center gap-1 flex-shrink-0"
                >
                  {copiedPublic ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPublic ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Private Owner Link */}
            <div className="p-4 bg-amber-50 rounded-xl border-3 border-black space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-950 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-700" />
                  {COPY.createdSuccess.ownerLinkLabel}
                </span>
                <span className="text-[10px] font-black bg-rose-200 text-rose-800 px-2 py-0.5 rounded border border-black">
                  SECRET
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={ownerManageUrl}
                  className="w-full text-xs font-mono font-bold bg-white border-2 border-black rounded-lg px-3 py-2 text-black select-all"
                />
                <button
                  onClick={() => copyText(ownerManageUrl, "owner")}
                  className="neo-btn bg-amber-300 text-black px-4 py-2 text-xs font-black flex items-center gap-1 flex-shrink-0"
                >
                  {copiedOwner ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedOwner ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <p className="text-[11px] font-bold text-rose-700 flex items-center gap-1 pt-1">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                {COPY.createdSuccess.disclaimerWarning}
              </p>
            </div>

            {/* Next Action */}
            <div className="pt-2">
              <Link
                href={`/b/${createdResult.slug}?key=${createdResult.secretKey}`}
                className="neo-btn w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-white text-base font-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000]"
              >
                <span>{COPY.createdSuccess.goToPool}</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* CREATION FORM */
          <div className="neo-box bg-white p-6 sm:p-8 space-y-6 shadow-neo-xl">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-black font-black text-xs rounded-full border-2 border-black shadow-[2px_2px_0px_#000]">
                <span>NO ACCOUNTS REQUIRED</span>
              </div>
              <h1 className="text-3xl font-black text-black tracking-tight">
                {COPY.createPage.title}
              </h1>
              <p className="text-sm font-bold text-gray-700">
                {COPY.createPage.subtitle}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-100 border-2 border-black rounded-xl text-xs font-bold text-rose-800 shadow-[2px_2px_0px_#000]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5 uppercase">
                  {COPY.createPage.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={COPY.createPage.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-black rounded-xl text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#000]"
                />
              </div>

              {/* Birthday Date */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5 uppercase">
                  {COPY.createPage.bdayLabel} *
                </label>
                <input
                  type="date"
                  required
                  value={birthdayDate}
                  onChange={(e) => setBirthdayDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-black rounded-xl text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#000]"
                />
              </div>

              {/* UPI ID */}
              <div>
                <label className="block text-xs font-black text-black mb-1 uppercase">
                  {COPY.createPage.upiLabel} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={COPY.createPage.upiPlaceholder}
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-black rounded-xl text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#000]"
                />
                <p className="text-[11px] font-bold text-gray-500 mt-1">
                  💡 {COPY.createPage.upiHint}
                </p>
              </div>

              {/* Avatar Emoji */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5 uppercase">
                  Pick your avatar emoji ✨
                </label>
                <div className="flex flex-wrap gap-2">
                  {APP_CONFIG.defaultEmojis.map((e) => (
                    <button
                      type="button"
                      key={e}
                      onClick={() => setAvatarEmoji(e)}
                      className={`w-11 h-11 text-2xl flex items-center justify-center rounded-xl border-2 border-black transition ${
                        avatarEmoji === e
                          ? "bg-secondary shadow-[3px_3px_0px_#000] scale-110"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio Message */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5 uppercase">
                  {COPY.createPage.messageLabel}
                </label>
                <textarea
                  rows={2}
                  placeholder={COPY.createPage.messagePlaceholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-black rounded-xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-primary resize-none shadow-[2px_2px_0px_#000]"
                />
              </div>

              {/* Theme Presets */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5 uppercase">
                  {COPY.createPage.themeLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.values(THEME_PRESETS).map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setThemeId(t.id)}
                      className={`p-3 rounded-xl border-2 border-black text-left flex items-center gap-3 transition ${
                        themeId === t.id
                          ? "bg-secondary shadow-[3px_3px_0px_#000] scale-[1.02]"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-2xl">{t.badge}</span>
                      <div>
                        <span className="text-xs font-black block text-black">{t.name}</span>
                        <span className="text-[11px] font-bold text-gray-600 block line-clamp-1">
                          {t.tagline}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="neo-btn w-full py-4 px-6 bg-primary hover:bg-primary-hover text-white text-lg font-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000]"
                >
                  <span>{isSubmitting ? COPY.createPage.submitting : COPY.createPage.submitButton}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
