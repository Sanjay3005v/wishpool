"use client";

import { useState } from "react";
import { BirthdayPool, Contribution } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { COPY } from "@/lib/copy";
import { fireConfetti } from "./Confetti";
import {
  Check,
  X,
  Share2,
  Key,
  Copy,
  Plus,
  Settings,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface OwnerDashboardProps {
  pool: BirthdayPool;
  secretKey: string;
  onRefresh: () => void;
  onOpenAddItem: () => void;
  onOpenEditPool: () => void;
}

export default function OwnerDashboard({
  pool,
  secretKey,
  onRefresh,
  onOpenAddItem,
  onOpenEditPool,
}: OwnerDashboardProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const pendingContributions = pool.contributions.filter((c) => c.status === "pending");
  const confirmedContributions = pool.contributions.filter((c) => c.status === "confirmed");
  const totalConfirmed = confirmedContributions.reduce((sum, c) => sum + c.amount, 0);
  const totalPending = pendingContributions.reduce((sum, c) => sum + c.amount, 0);

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/b/${pool.slug}` : "";
  const ownerUrl = typeof window !== "undefined" ? `${window.location.origin}/b/${pool.slug}?key=${secretKey}` : "";

  const handleUpdateStatus = async (contributionId: string, status: "confirmed" | "rejected") => {
    setUpdatingId(contributionId);
    try {
      const res = await fetch(`/api/pools/${pool.slug}/contributions`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-owner-key": secretKey,
        },
        body: JSON.stringify({
          contributionId,
          status,
        }),
      });

      if (res.ok) {
        if (status === "confirmed") {
          fireConfetti();
        }
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to update contribution status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const copyToClipboard = (text: string, type: "share" | "key") => {
    navigator.clipboard.writeText(text);
    if (type === "share") {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="w-full mb-10 space-y-6">
      {/* Top Banner: Owner Mode */}
      <div className="neo-box bg-secondary/30 border-3 border-black p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary border-2 border-black flex items-center justify-center text-xl shadow-[2px_2px_0px_#000]">
            👑
          </div>
          <div>
            <h2 className="font-black text-lg text-black flex items-center gap-2">
              Owner Dashboard
              <span className="bg-primary text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_#000]">
                Private Mode
              </span>
            </h2>
            <p className="text-xs font-bold text-gray-700">
              Review incoming UPI payments, add gifts, and tweak settings.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <button
            onClick={onOpenAddItem}
            className="neo-btn bg-primary hover:bg-primary-hover text-white px-3.5 py-2 text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
          <button
            onClick={onOpenEditPool}
            className="neo-btn bg-white hover:bg-gray-100 text-black px-3.5 py-2 text-xs flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4" />
            <span>Pool Settings</span>
          </button>
        </div>
      </div>

      {/* Share Links Card */}
      <div className="neo-box bg-white p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Squad Share Link */}
        <div className="p-3 bg-muted/40 rounded-xl border-2 border-black space-y-1.5">
          <span className="text-xs font-black uppercase text-black flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" />
            Squad Share Link (Send this to friends!)
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="w-full text-xs font-mono font-bold bg-white border border-black rounded-lg px-2.5 py-1.5 text-gray-800 select-all"
            />
            <button
              onClick={() => copyToClipboard(publicUrl, "share")}
              className="neo-btn bg-secondary text-black px-3 py-1.5 text-xs flex items-center gap-1 flex-shrink-0"
            >
              {copiedShare ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedShare ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Secret Owner Link */}
        <div className="p-3 bg-amber-50 rounded-xl border-2 border-black space-y-1.5">
          <span className="text-xs font-black uppercase text-amber-950 flex items-center gap-1">
            <Key className="w-3.5 h-3.5 text-amber-700" />
            Secret Owner Link (Keep private!)
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={ownerUrl}
              className="w-full text-xs font-mono font-bold bg-white border border-black rounded-lg px-2.5 py-1.5 text-gray-800 select-all"
            />
            <button
              onClick={() => copyToClipboard(ownerUrl, "key")}
              className="neo-btn bg-amber-200 text-black px-3 py-1.5 text-xs flex items-center gap-1 flex-shrink-0"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="neo-box bg-white p-3.5 border-2 border-black">
          <span className="text-[11px] font-black uppercase text-gray-500">Confirmed Received</span>
          <p className="text-xl sm:text-2xl font-black text-black mt-0.5">{formatINR(totalConfirmed)}</p>
          <span className="text-[10px] font-bold text-emerald-600">
            {confirmedContributions.length} contribution(s)
          </span>
        </div>
        <div className="neo-box bg-white p-3.5 border-2 border-black">
          <span className="text-[11px] font-black uppercase text-gray-500">Pending Verification</span>
          <p className="text-xl sm:text-2xl font-black text-amber-700 mt-0.5">{formatINR(totalPending)}</p>
          <span className="text-[10px] font-bold text-amber-600">
            {pendingContributions.length} waiting for approval
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1 neo-box bg-white p-3.5 border-2 border-black">
          <span className="text-[11px] font-black uppercase text-gray-500">Wishlist Items</span>
          <p className="text-xl sm:text-2xl font-black text-black mt-0.5">{pool.items.length}</p>
          <span className="text-[10px] font-bold text-primary">
            {pool.items.filter((i) => {
              const itemTotal = pool.contributions
                .filter((c) => c.itemId === i.id && c.status === "confirmed")
                .reduce((s, c) => s + c.amount, 0);
              return itemTotal >= i.price;
            }).length}{" "}
            funded
          </span>
        </div>
      </div>

      {/* Pending Contributions Section */}
      <div className="neo-box bg-white p-5 border-3 border-black">
        <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h3 className="font-black text-base text-black">
              Pending Contributions ({pendingContributions.length})
            </h3>
          </div>
          <span className="text-xs font-bold text-gray-600">
            Check your bank/UPI app and verify each!
          </span>
        </div>

        {pendingContributions.length === 0 ? (
          <div className="p-6 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <span className="text-3xl block mb-2">✨</span>
            <p className="text-xs font-black text-gray-700">{COPY.owner.noPending}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingContributions.map((c) => (
              <div
                key={c.id}
                className="p-3 bg-amber-50/60 rounded-xl border-2 border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[2px_2px_0px_#000]"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-black">
                      {c.contributorName}
                      {c.isAnonymous && " (Marked anonymous to public)"}
                    </span>
                    <span className="text-xs font-black bg-secondary px-2 py-0.5 rounded border border-black">
                      {formatINR(c.amount)}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-700">
                    For: <span className="text-black font-black">{c.itemTitle || "Gift Item"}</span>
                  </p>
                  {c.message && (
                    <p className="text-xs italic text-gray-600 bg-white/80 p-1.5 rounded border border-black/20">
                      &ldquo;{c.message}&rdquo;
                    </p>
                  )}
                  <span className="text-[10px] text-gray-500 font-medium block">
                    Reported {new Date(c.createdAt).toLocaleDateString()} at{" "}
                    {new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {/* Verification Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    disabled={updatingId === c.id}
                    onClick={() => handleUpdateStatus(c.id, "confirmed")}
                    className="neo-btn flex-1 sm:flex-initial py-1.5 px-3 bg-emerald-300 hover:bg-emerald-400 text-black text-xs font-black flex items-center justify-center gap-1 shadow-[2px_2px_0px_#000]"
                  >
                    <Check className="w-4 h-4 text-emerald-800" />
                    <span>{COPY.owner.markReceived}</span>
                  </button>
                  <button
                    disabled={updatingId === c.id}
                    onClick={() => handleUpdateStatus(c.id, "rejected")}
                    className="neo-btn flex-1 sm:flex-initial py-1.5 px-3 bg-rose-200 hover:bg-rose-300 text-black text-xs font-black flex items-center justify-center gap-1 shadow-[2px_2px_0px_#000]"
                  >
                    <X className="w-4 h-4 text-rose-800" />
                    <span>{COPY.owner.markNotReceived}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
