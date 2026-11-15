import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { COPY } from "@/lib/copy";
import { APP_CONFIG } from "@/lib/config";
import { Sparkles, ArrowRight, Gift, Smartphone, HeartHandshake, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF0F5] bg-dots">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 md:py-16 w-full space-y-16">
        {/* HERO SECTION */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary text-black font-black text-xs md:text-sm rounded-full border-2 border-black shadow-[3px_3px_0px_#000] rotate-[-1deg] hover:rotate-1 transition-transform">
            <span>{COPY.hero.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-black tracking-tight leading-[1.08]">
            Fund the gifts <br />
            <span className="bg-primary text-white px-3 py-0.5 inline-block -rotate-1 rounded-lg border-3 border-black shadow-[4px_4px_0px_#000]">
              they actually want.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl font-bold text-gray-800 max-w-2xl mx-auto leading-relaxed">
            {COPY.hero.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/create"
              className="neo-btn w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white text-lg font-black flex items-center justify-center gap-2 shadow-[5px_5px_0px_#000]"
            >
              <span>{COPY.hero.createCta}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#how-it-works"
              className="neo-btn w-full sm:w-auto px-6 py-4 bg-white hover:bg-gray-100 text-black text-base font-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000]"
            >
              <span>{COPY.hero.exploreDemo}</span>
            </a>
          </div>

          {/* Quick proof pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-black text-gray-700">
            <span className="bg-white px-2.5 py-1 rounded-md border border-black shadow-[1px_1px_0px_#000]">
              ⚡ No Login Required
            </span>
            <span className="bg-white px-2.5 py-1 rounded-md border border-black shadow-[1px_1px_0px_#000]">
              💸 Direct UPI, 0% Platform Fee
            </span>
            <span className="bg-white px-2.5 py-1 rounded-md border border-black shadow-[1px_1px_0px_#000]">
              🔒 Private Owner Link
            </span>
          </div>
        </section>

        {/* INTERACTIVE DEMO CARD SHOWCASE */}
        <section className="max-w-md mx-auto">
          <div className="neo-box bg-white p-5 rotate-[1deg] hover:rotate-0 transition-all shadow-[6px_6px_0px_#000]">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-rose-300 text-black border-2 border-black">
                🔥 MUST HAVE
              </span>
              <span className="text-[11px] font-black bg-secondary px-2 py-0.5 rounded border border-black">
                Aarav&apos;s 21st 🎂
              </span>
            </div>

            <div className="w-full h-40 rounded-xl border-3 border-black bg-muted/50 flex items-center justify-center text-6xl shadow-[2px_2px_0px_#000] mb-4">
              🎧
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h4 className="font-black text-lg text-black">Sony Noise-Canceling Headphones</h4>
              </div>
              <p className="text-xs font-bold text-gray-700">
                Target: <span className="font-black text-black">₹19,990</span>
              </p>

              {/* Progress Bar Demo */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-black">
                  <span>₹14,500 raised</span>
                  <span className="text-gray-500">72%</span>
                </div>
                <div className="w-full h-4 bg-gray-100 border-2 border-black rounded-lg overflow-hidden flex shadow-[1px_1px_0px_#000]">
                  <div style={{ width: "72%" }} className="h-full bg-primary" />
                  <div style={{ width: "12%" }} className="h-full bg-secondary bg-stripes-pending" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <div className="flex -space-x-2">
                  {["👑", "🕶️", "🍕", "⚡"].map((e, idx) => (
                    <div
                      key={idx}
                      className="w-7 h-7 rounded-full bg-muted border-2 border-black flex items-center justify-center text-xs"
                    >
                      {e}
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full bg-secondary border-2 border-black flex items-center justify-center text-[10px] font-black">
                    +6
                  </div>
                </div>
                <span className="neo-btn py-1.5 px-3 bg-primary text-white text-xs font-black inline-flex items-center gap-1">
                  Chip in 💸
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="pt-8 space-y-8 scroll-mt-24">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              {COPY.howItWorks.title}
            </h2>
            <p className="text-sm font-bold text-gray-700">
              No middleman holding funds. 100% friend-to-friend trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COPY.howItWorks.steps.map((s, idx) => (
              <div
                key={s.step}
                className="neo-box bg-white p-6 relative flex flex-col justify-between hover:translate-y-[-4px] transition-transform shadow-neo"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{s.emoji}</span>
                    <span className="text-xs font-black bg-muted px-2 py-1 rounded-md border border-black">
                      STEP {s.step}
                    </span>
                  </div>
                  <h3 className="font-black text-xl text-black mb-2">{s.title}</h3>
                  <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="neo-box bg-primary p-8 md:p-12 text-center text-white relative overflow-hidden shadow-neo-xl border-4 border-black">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Ready to ditch the cringe gift cards? 🎁
            </h2>
            <p className="text-sm sm:text-base font-bold text-white/90">
              Set up your wishlist in 60 seconds, share the link, and let your squad pool together!
            </p>
            <div className="pt-2">
              <Link
                href="/create"
                className="neo-btn inline-flex items-center gap-2 px-8 py-4 bg-secondary hover:bg-secondary-hover text-black text-lg font-black shadow-[4px_4px_0px_#000]"
              >
                <span>Make My WishPool Now 🚀</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
