import { ItemProgress } from "@/lib/types";
import { formatINR } from "@/lib/utils";

export default function ProgressBar({
  progress,
  className = "",
}: {
  progress: ItemProgress;
  className?: string;
}) {
  const { confirmedAmount, pendingAmount, totalTarget, confirmedPercent, pendingPercent, isFunded } =
    progress;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {/* Numbers Row */}
      <div className="flex items-center justify-between text-xs font-black">
        <span className="flex items-center gap-1.5">
          <span className="text-black font-extrabold">{formatINR(confirmedAmount)}</span>
          {pendingAmount > 0 && (
            <span className="text-amber-700 bg-amber-100 border border-black/40 px-1 py-0.2 rounded text-[10px] font-bold">
              +{formatINR(pendingAmount)} pending
            </span>
          )}
        </span>
        <span className="text-gray-600 font-bold">Goal: {formatINR(totalTarget)}</span>
      </div>

      {/* Bar container */}
      <div className="w-full h-5 bg-gray-100 border-2 border-black rounded-lg overflow-hidden flex relative shadow-[1px_1px_0px_#000]">
        {/* Confirmed progress (solid primary) */}
        <div
          style={{ width: `${confirmedPercent}%` }}
          className="h-full bg-primary transition-all duration-500 ease-out flex items-center justify-center"
        />

        {/* Pending progress (striped secondary/amber) */}
        <div
          style={{ width: `${pendingPercent}%` }}
          className="h-full bg-secondary bg-stripes-pending transition-all duration-500 ease-out border-l border-black/20"
        />

        {/* Center overlay text if funded */}
        {isFunded && (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] tracking-wider">
            100% FUNDED 🎉
          </div>
        )}
      </div>

      {/* Percentage hint */}
      <div className="flex justify-between items-center text-[11px] font-bold text-gray-700 px-0.5">
        <span>{confirmedPercent}% confirmed</span>
        {isFunded ? (
          <span className="text-emerald-700 font-black">Ready to unlock 🔓</span>
        ) : (
          <span>{formatINR(progress.remainingAmount)} left</span>
        )}
      </div>
    </div>
  );
}
