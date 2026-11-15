"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { WishlistItem, ItemProgress } from "@/lib/types";
import { APP_CONFIG } from "@/lib/config";
import { COPY } from "@/lib/copy";
import { formatINR, generateUpiUri } from "@/lib/utils";
import { fireConfetti } from "./Confetti";
import { X, Smartphone, CheckCheck, Sparkles, Copy, Check } from "lucide-react";

interface ChipInModalProps {
  item: WishlistItem;
  progress: ItemProgress;
  upiId: string;
  birthdayPersonName: string;
  slug: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChipInModal({
  item,
  progress,
  upiId,
  birthdayPersonName,
  slug,
  onClose,
  onSuccess,
}: ChipInModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number>(() => {
    const defaultAmt = 250;
    return progress.remainingAmount > 0
      ? Math.min(defaultAmt, progress.remainingAmount)
      : defaultAmt;
  });
  const [customAmountStr, setCustomAmountStr] = useState(amount.toString());
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Maximum allowed contribution
  const maxAllowed = progress.remainingAmount > 0 ? progress.remainingAmount : 50000;

  const handleAmountSelect = (val: number) => {
    const capped = Math.min(val, maxAllowed);
    setAmount(capped);
    setCustomAmountStr(capped.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmountStr(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setAmount(num);
    } else {
      setAmount(0);
    }
  };

  // Generate UPI URI
  const upiUri = generateUpiUri({
    vpa: upiId,
    payeeName: birthdayPersonName,
    amount: amount > 0 ? amount : 100,
    note: `${birthdayPersonName}'s bday - ${item.title}`.slice(0, 40),
  });

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmPaid = async () => {
    if (!name.trim() && !isAnonymous) {
      setError("Please enter your name or toggle 'Stay mysterious'!");
      return;
    }
    if (amount <= 0) {
      setError("Please enter a valid amount greater than ₹0");
      return;
    }
    if (amount > maxAllowed && !item.allowOverfunding) {
      setError(`Maximum remaining needed is ${formatINR(maxAllowed)}`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/pools/${slug}/contributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          contributorName: isAnonymous ? "Secret Bestie" : name.trim(),
          isAnonymous,
          message: message.trim(),
          amount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to record contribution");
      }

      fireConfetti();
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white neo-box p-6 my-8 animate-pop">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{item.emoji || "🎁"}</span>
            <div>
              <h2 className="font-black text-xl text-black leading-tight">Chip in for {item.title}</h2>
              <p className="text-xs font-bold text-gray-600">
                Direct to {birthdayPersonName}&apos;s UPI ({upiId})
              </p>
            </div>
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

        <div className="space-y-4">
          {/* STEP 1: Name & Amount */}
          <div className="p-3 bg-muted/40 rounded-xl border-2 border-black space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1">
              {COPY.chipInModal.step1Title}
            </span>

            {/* Contributor Name */}
            <div>
              <label className="block text-xs font-black text-black mb-1">
                {COPY.chipInModal.nameLabel}
              </label>
              <input
                type="text"
                disabled={isAnonymous}
                placeholder={isAnonymous ? "Secret Bestie 🕶️" : COPY.chipInModal.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-200"
              />
            </div>

            {/* Anonymous Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-black text-primary focus:ring-primary accent-primary"
              />
              <span className="text-xs font-bold text-gray-800">
                {COPY.chipInModal.anonToggle}
              </span>
            </label>

            {/* Message / Roast */}
            <div>
              <label className="block text-xs font-black text-black mb-1">
                {COPY.chipInModal.messageLabel}
              </label>
              <textarea
                rows={2}
                placeholder={COPY.chipInModal.messagePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Quick Pick Chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black text-black">Amount</label>
                <span className="text-[11px] font-bold text-gray-600">
                  Cap: {formatINR(maxAllowed)}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-2">
                {APP_CONFIG.quickChipAmounts.map((amt) => {
                  const isExceeded = amt > maxAllowed && !item.allowOverfunding;
                  const isSelected = amount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      disabled={isExceeded}
                      onClick={() => handleAmountSelect(amt)}
                      className={`py-1.5 text-xs font-black rounded-lg border-2 border-black transition ${
                        isSelected
                          ? "bg-primary text-white shadow-[2px_2px_0px_#000]"
                          : isExceeded
                          ? "bg-gray-200 text-gray-400 border-gray-400 cursor-not-allowed"
                          : "bg-white text-black hover:bg-gray-100 shadow-[1px_1px_0px_#000]"
                      }`}
                    >
                      ₹{amt}
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount input */}
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-black text-sm text-gray-500">₹</span>
                <input
                  type="text"
                  value={customAmountStr}
                  onChange={handleCustomAmountChange}
                  placeholder="Custom amount"
                  className="w-full pl-7 pr-3 py-2 border-2 border-black rounded-lg text-sm font-black text-black focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* STEP 2: UPI QR & Mobile App Button */}
          <div className="p-3 bg-secondary/20 rounded-xl border-2 border-black space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1">
              {COPY.chipInModal.step2Title}
            </span>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]">
              {/* QR Code */}
              <div className="p-2 bg-white rounded-lg border-2 border-black flex-shrink-0 shadow-[2px_2px_0px_#000]">
                <QRCodeSVG
                  value={upiUri}
                  size={120}
                  level="M"
                  includeMargin={false}
                />
              </div>

              {/* Pay info & mobile button */}
              <div className="flex-1 flex flex-col justify-between w-full text-center sm:text-left gap-2">
                <div>
                  <p className="text-xs font-bold text-gray-700">Scan QR or copy UPI ID:</p>
                  <div className="mt-1 flex items-center justify-center sm:justify-start gap-1">
                    <code className="text-xs font-black bg-gray-100 border border-black/40 px-2 py-1 rounded">
                      {upiId}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1 border border-black rounded hover:bg-gray-200 transition"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Deep Link to UPI Apps (GPay, PhonePe, Paytm, etc.) */}
                <a
                  href={upiUri}
                  className="neo-btn w-full py-2 px-3 bg-secondary hover:bg-secondary-hover text-black text-xs flex items-center justify-center gap-1.5"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{COPY.chipInModal.openUpiAppCta}</span>
                </a>
              </div>
            </div>
          </div>

          {/* STEP 3: "Paid, trust me bro" Button */}
          <div className="pt-2">
            <button
              onClick={handleConfirmPaid}
              disabled={isSubmitting || amount <= 0}
              className="neo-btn w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white text-base tracking-wide flex items-center justify-center gap-2 active:scale-95"
            >
              <CheckCheck className="w-5 h-5" />
              <span>{isSubmitting ? COPY.chipInModal.processing : COPY.chipInModal.paidConfirmCta}</span>
            </button>
            <p className="text-center text-[11px] font-bold text-gray-500 mt-2">
              Self-reported UPI. The birthday legend will verify receipt on their dashboard!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
