import { Contribution } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { COPY } from "@/lib/copy";
import { MessageSquareHeart, Sparkles } from "lucide-react";

interface WallOfLoveProps {
  contributions: Contribution[];
}

export default function WallOfLove({ contributions }: WallOfLoveProps) {
  // Show only confirmed contributions (or if empty, show friendly prompt)
  const confirmed = contributions.filter((c) => c.status === "confirmed");

  return (
    <div className="neo-box bg-white p-6 border-3 border-black w-full mt-12 shadow-neo-lg">
      <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-6">
        <div className="flex items-center gap-2">
          <MessageSquareHeart className="w-6 h-6 text-primary" />
          <h2 className="font-black text-xl text-black">{COPY.pool.wallOfLoveTitle}</h2>
        </div>
        <span className="text-xs font-black bg-secondary px-2.5 py-1 rounded-full border border-black shadow-[1px_1px_0px_#000]">
          {confirmed.length} legend{confirmed.length === 1 ? "" : "s"}
        </span>
      </div>

      {confirmed.length === 0 ? (
        <div className="p-8 text-center bg-muted/30 rounded-xl border-2 border-dashed border-black/30">
          <span className="text-4xl block mb-2">💌</span>
          <p className="text-sm font-black text-gray-800">{COPY.pool.wallOfLoveEmpty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {confirmed.map((c, i) => (
            <div
              key={c.id}
              className={`p-4 rounded-xl border-2 border-black bg-card shadow-[3px_3px_0px_#000] flex flex-col justify-between gap-2 ${
                i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{c.isAnonymous ? "🕶️" : "👑"}</span>
                    <span className="font-black text-sm text-black">
                      {c.isAnonymous ? "Secret Bestie" : c.contributorName}
                    </span>
                  </div>
                  <span className="text-xs font-black bg-primary text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                    {formatINR(c.amount)}
                  </span>
                </div>

                {c.message ? (
                  <p className="text-xs font-medium text-gray-800 bg-muted/40 p-2 rounded-lg border border-black/10 mt-2 leading-relaxed">
                    &ldquo;{c.message}&rdquo;
                  </p>
                ) : (
                  <p className="text-[11px] font-bold text-gray-500 mt-2 italic">
                    Chipped in with pure love & no notes ✨
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold pt-2 border-t border-black/10">
                <span>{c.itemTitle ? `For: ${c.itemTitle}` : "Gift fund"}</span>
                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
