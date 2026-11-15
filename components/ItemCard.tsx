"use client";

import { useState } from "react";
import Image from "next/image";
import { WishlistItem, Contribution, ItemProgress } from "@/lib/types";
import { calculateItemProgress, formatINR } from "@/lib/utils";
import ProgressBar from "./ProgressBar";
import { ExternalLink, Edit3, Trash2, HeartHandshake, CheckCircle2 } from "lucide-react";

interface ItemCardProps {
  item: WishlistItem;
  contributions: Contribution[];
  isOwner?: boolean;
  onChipIn: (item: WishlistItem, progress: ItemProgress) => void;
  onEdit?: (item: WishlistItem) => void;
  onDelete?: (itemId: string) => void;
  index: number;
}

export default function ItemCard({
  item,
  contributions,
  isOwner,
  onChipIn,
  onEdit,
  onDelete,
  index,
}: ItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const progress = calculateItemProgress(item, contributions);

  // Slight alternating rotation for neo-brutalist aesthetic
  const rotationClass =
    index % 3 === 0 ? "hover:rotate-1" : index % 3 === 1 ? "hover:-rotate-1" : "hover:rotate-0";

  return (
    <div
      className={`neo-box relative flex flex-col justify-between overflow-hidden bg-white p-5 transition-transform duration-200 ${rotationClass} hover:shadow-neo-lg`}
    >
      {/* Top badges row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-full border-2 border-black shadow-[1px_1px_0px_#000] ${
            item.priority === "must_have"
              ? "bg-rose-300 text-black"
              : "bg-sky-200 text-black"
          }`}
        >
          {item.priority === "must_have" ? "🔥 MUST HAVE" : "✨ NICE TO HAVE"}
        </span>

        {/* Funded badge */}
        {progress.isFunded && (
          <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-secondary text-black border-2 border-black shadow-[1px_1px_0px_#000] animate-bounce">
            🎉 FUNDED!
          </span>
        )}

        {/* Owner Controls */}
        {isOwner && (
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => onEdit && onEdit(item)}
              title="Edit Item"
              className="p-1.5 rounded-lg bg-gray-100 border border-black hover:bg-gray-200 transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-black" />
            </button>
            <button
              onClick={() => onDelete && onDelete(item.id)}
              title="Delete Item"
              className="p-1.5 rounded-lg bg-rose-100 border border-black hover:bg-rose-200 transition text-rose-700"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Item Image or Big Emoji */}
      <div className="w-full h-44 rounded-xl border-3 border-black bg-muted/40 relative overflow-hidden flex items-center justify-center mb-4 shadow-[2px_2px_0px_#000]">
        {item.imageUrl && !imageError ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-6xl filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.4)] select-none">
            {item.emoji || "🎁"}
          </span>
        )}

        {/* Overfunding badge tag if enabled */}
        {item.allowOverfunding && (
          <span className="absolute bottom-2 right-2 bg-yellow-300 text-black text-[10px] font-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
            +10% Buffer
          </span>
        )}
      </div>

      {/* Item Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-black text-lg text-black line-clamp-2 leading-tight">
              {item.title}
            </h3>
            {item.productUrl && (
              <a
                href={item.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary transition flex-shrink-0 mt-0.5"
                title="View product store link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          <p className="text-sm font-bold text-gray-800 mt-1">
            Target: <span className="font-black text-black">{formatINR(item.price)}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="my-4">
          <ProgressBar progress={progress} />
        </div>

        {/* Chip in Button */}
        <div>
          {progress.isFunded && !item.allowOverfunding ? (
            <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-100 border-2 border-black font-black text-emerald-800 text-sm text-center flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000]">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Goal Reached!
            </div>
          ) : (
            <button
              onClick={() => onChipIn(item, progress)}
              className="neo-btn w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white flex items-center justify-center gap-2 text-sm tracking-wide active:scale-95 transition"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Chip in 💸</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
