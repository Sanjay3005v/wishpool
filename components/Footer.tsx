import { APP_CONFIG } from "@/lib/config";
import { Heart, ShieldAlert } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t-4 border-black bg-white mt-16 px-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-4">
        {/* Safety Disclaimer */}
        <div className="w-full max-w-xl bg-amber-100 border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_#000] flex items-center gap-3 text-left">
          <ShieldAlert className="w-6 h-6 text-black flex-shrink-0" />
          <p className="text-xs text-black font-semibold leading-relaxed">
            <span className="font-black uppercase">Direct UPI Only: </span>
            {APP_CONFIG.disclaimer}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-4 border-t-2 border-black/10 gap-2 text-xs font-bold text-gray-700">
          <p className="flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-primary fill-primary inline" /> for wholesome birthdays & zero junk gifts.
          </p>
          <p>
            {APP_CONFIG.name} &bull; No accounts &bull; Frictionless
          </p>
        </div>
      </div>
    </footer>
  );
}
