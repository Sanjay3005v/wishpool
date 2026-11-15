import Link from "next/link";
import { APP_CONFIG } from "@/lib/config";
import { Sparkles, PlusCircle } from "lucide-react";

export default function Navbar({
  poolName,
  slug,
  isOwner,
}: {
  poolName?: string;
  slug?: string;
  isOwner?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b-4 border-black bg-white/95 backdrop-blur px-4 py-3 shadow-[0_4px_0_0_#000]">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-black text-xl group-hover:rotate-6 transition-transform">
            🎂
          </div>
          <div>
            <span className="font-black text-xl md:text-2xl tracking-tight text-black flex items-center gap-1">
              {APP_CONFIG.name}
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-black font-bold uppercase tracking-wider text-black">
                vibe
              </span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {poolName ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-muted border-2 border-black rounded-lg text-xs font-bold text-black">
              <span>{poolName}&apos;s Pool</span>
              {isOwner && (
                <span className="bg-primary text-white px-1.5 py-0.5 rounded text-[10px] uppercase font-black">
                  Owner
                </span>
              )}
            </div>
          ) : null}

          <Link
            href="/create"
            className="neo-btn bg-secondary hover:bg-secondary-hover text-black px-3.5 py-2 text-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden xs:inline">Make a Pool</span>
            <span className="xs:hidden">New</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
