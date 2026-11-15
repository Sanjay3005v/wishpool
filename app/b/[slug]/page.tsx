"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItemCard from "@/components/ItemCard";
import ChipInModal from "@/components/ChipInModal";
import AddItemModal from "@/components/AddItemModal";
import EditItemModal from "@/components/EditItemModal";
import EditPoolModal from "@/components/EditPoolModal";
import OwnerDashboard from "@/components/OwnerDashboard";
import WallOfLove from "@/components/WallOfLove";
import ThemeWrapper from "@/components/ThemeWrapper";
import { BirthdayPool, WishlistItem, ItemProgress } from "@/lib/types";
import { COPY } from "@/lib/copy";
import { daysUntilBirthday, formatINR } from "@/lib/utils";
import { fireConfetti, fireSchoolPrideConfetti } from "@/components/Confetti";
import {
  Sparkles,
  Calendar,
  Gift,
  Plus,
  Lock,
  Share2,
  Check,
  Copy,
  Info,
} from "lucide-react";

export default function BirthdayPoolPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;

  // Secret key from query param or localStorage
  const urlKey = searchParams.get("key");

  const [pool, setPool] = useState<BirthdayPool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active secret key (if owner)
  const [secretKey, setSecretKey] = useState<string>(urlKey || "");

  // Modals state
  const [chipInItem, setChipInItem] = useState<{
    item: WishlistItem;
    progress: ItemProgress;
  } | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [isEditPoolOpen, setIsEditPoolOpen] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Sync secretKey with localStorage or URL
  useEffect(() => {
    if (urlKey) {
      setSecretKey(urlKey);
      try {
        localStorage.setItem(`wishpool_key_${slug}`, urlKey);
      } catch (_) {}
    } else if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`wishpool_key_${slug}`);
        if (stored) {
          setSecretKey(stored);
        }
      } catch (_) {}
    }
  }, [slug, urlKey]);

  // Fetch pool data
  const fetchPool = useCallback(async () => {
    if (!slug) return;
    try {
      const headers: Record<string, string> = {};
      if (secretKey) {
        headers["x-owner-key"] = secretKey;
      }

      const res = await fetch(`/api/pools/${slug}${secretKey ? `?key=${secretKey}` : ""}`, {
        headers,
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("This WishPool doesn't exist or has expired.");
        }
        throw new Error("Failed to load WishPool.");
      }

      const data = await res.json();
      setPool(data);
    } catch (err: any) {
      setError(err.message || "Failed to load pool");
    } finally {
      setLoading(false);
    }
  }, [slug, secretKey]);

  useEffect(() => {
    fetchPool();
  }, [fetchPool]);

  // Handle item deletion
  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to remove this gift from your wishlist?")) return;
    try {
      const res = await fetch(`/api/pools/${slug}/items/${itemId}`, {
        method: "DELETE",
        headers: { "x-owner-key": secretKey },
      });
      if (res.ok) {
        fetchPool();
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleCopyShareLink = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/b/${slug}` : "";
    navigator.clipboard.writeText(url);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF0F5] p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center text-3xl animate-bounce">
          🎂
        </div>
        <p className="mt-4 font-black text-lg text-black">Loading birthday magic...</p>
      </div>
    );
  }

  if (error || !pool) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF0F5] p-4 text-center">
        <div className="neo-box bg-white p-8 max-w-md mx-auto space-y-4 shadow-neo-xl">
          <span className="text-5xl block">🛸</span>
          <h1 className="text-2xl font-black text-black">Oops! Pool Not Found</h1>
          <p className="text-sm font-bold text-gray-700">{error || "Could not find this WishPool."}</p>
          <a
            href="/"
            className="neo-btn inline-block px-5 py-2.5 bg-primary text-white font-black text-sm"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  const isOwner = (pool as any).isOwner === true;
  const daysLeft = daysUntilBirthday(pool.birthdayDate);

  return (
    <ThemeWrapper themeId={pool.themeId} customAccent={pool.customAccent}>
      <Navbar poolName={pool.name} slug={pool.slug} isOwner={isOwner} />

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12 w-full">
        {/* Pool Header Hero */}
        <section className="neo-box bg-white p-6 sm:p-8 mb-8 relative overflow-hidden shadow-neo-xl border-4 border-black">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar Emoji Box */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-secondary border-3 border-black flex items-center justify-center text-5xl sm:text-6xl flex-shrink-0 shadow-[4px_4px_0px_#000] rotate-[-2deg] hover:rotate-2 transition-transform">
              {pool.avatarEmoji || "🎂"}
            </div>

            {/* Main Details */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-secondary text-black border-2 border-black shadow-[2px_2px_0px_#000]">
                  {COPY.pool.daysLeft(daysLeft)}
                </span>
                {pool.isClosed && (
                  <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-rose-200 text-rose-800 border-2 border-black">
                    {COPY.pool.statusClosed}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight leading-none">
                {pool.name}&apos;s WishPool
              </h1>

              {pool.message && (
                <p className="text-sm sm:text-base font-bold text-gray-800 bg-muted/30 p-3 rounded-xl border-2 border-black/10 inline-block">
                  &ldquo;{pool.message}&rdquo;
                </p>
              )}

              {/* Share & UPI Action Row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                <button
                  onClick={handleCopyShareLink}
                  className="neo-btn bg-white hover:bg-gray-100 text-black px-3.5 py-2 text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
                >
                  {copiedShareLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedShareLink ? "Link Copied! 📋" : "Share Pool"}</span>
                </button>

                <div className="px-3 py-2 bg-muted rounded-xl border-2 border-black text-xs font-bold text-black flex items-center gap-1.5">
                  <span>Direct UPI:</span>
                  <code className="font-mono font-black">{pool.upiId}</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OWNER DASHBOARD SECTION (Visible only if isOwner is true) */}
        {isOwner && (
          <OwnerDashboard
            pool={pool}
            secretKey={secretKey}
            onRefresh={fetchPool}
            onOpenAddItem={() => setIsAddItemOpen(true)}
            onOpenEditPool={() => setIsEditPoolOpen(true)}
          />
        )}

        {/* WISHLIST SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight flex items-center gap-2">
                <span>The Wishlist</span>
                <span className="text-sm font-black bg-primary text-white px-2.5 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_#000]">
                  {pool.items.length}
                </span>
              </h2>
              <p className="text-xs font-bold text-gray-700">
                Pick a gift and chip in whatever you like!
              </p>
            </div>

            {isOwner && (
              <button
                onClick={() => setIsAddItemOpen(true)}
                className="neo-btn bg-primary hover:bg-primary-hover text-white px-4 py-2 text-xs font-black flex items-center gap-1.5 shadow-[3px_3px_0px_#000]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            )}
          </div>

          {pool.items.length === 0 ? (
            <div className="neo-box bg-white p-12 text-center space-y-4 border-3 border-black">
              <span className="text-5xl block animate-bounce">🎁</span>
              <h3 className="text-xl font-black text-black">No gifts added yet!</h3>
              <p className="text-xs font-bold text-gray-600 max-w-sm mx-auto">
                {isOwner
                  ? "Tap the button below to add the first dream gift to your wishlist!"
                  : "The birthday legend hasn't listed items yet. Check back in a few!"}
              </p>
              {isOwner && (
                <button
                  onClick={() => setIsAddItemOpen(true)}
                  className="neo-btn px-6 py-3 bg-secondary hover:bg-secondary-hover text-black font-black text-sm"
                >
                  Add First Gift ➕
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pool.items.map((item, index) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  contributions={pool.contributions}
                  isOwner={isOwner}
                  index={index}
                  onChipIn={(selectedItem, progress) => {
                    if (pool.isClosed) {
                      alert("This pool is closed by the birthday legend.");
                      return;
                    }
                    setChipInItem({ item: selectedItem, progress });
                  }}
                  onEdit={(selectedItem) => setEditingItem(selectedItem)}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          )}
        </section>

        {/* WALL OF LOVE SECTION */}
        <WallOfLove contributions={pool.contributions} />
      </main>

      {/* CHIP IN MODAL */}
      {chipInItem && (
        <ChipInModal
          item={chipInItem.item}
          progress={chipInItem.progress}
          upiId={pool.upiId}
          birthdayPersonName={pool.name}
          slug={pool.slug}
          onClose={() => setChipInItem(null)}
          onSuccess={() => {
            setChipInItem(null);
            fetchPool();
          }}
        />
      )}

      {/* ADD ITEM MODAL */}
      {isAddItemOpen && isOwner && (
        <AddItemModal
          slug={pool.slug}
          secretKey={secretKey}
          onClose={() => setIsAddItemOpen(false)}
          onSuccess={() => {
            setIsAddItemOpen(false);
            fetchPool();
            fireConfetti();
          }}
        />
      )}

      {/* EDIT ITEM MODAL */}
      {editingItem && isOwner && (
        <EditItemModal
          item={editingItem}
          slug={pool.slug}
          secretKey={secretKey}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            setEditingItem(null);
            fetchPool();
          }}
        />
      )}

      {/* EDIT POOL SETTINGS MODAL */}
      {isEditPoolOpen && isOwner && (
        <EditPoolModal
          pool={pool}
          secretKey={secretKey}
          onClose={() => setIsEditPoolOpen(false)}
          onSuccess={() => {
            setIsEditPoolOpen(false);
            fetchPool();
          }}
        />
      )}

      <Footer />
    </ThemeWrapper>
  );
}
