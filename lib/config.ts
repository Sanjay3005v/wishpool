export const APP_CONFIG = {
  name: "WishPool",
  tagline: "Group-fund birthday dreams via UPI. No junk, no drama, pure vibes.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  disclaimer:
    "Payments go directly to the birthday person's UPI. WishPool doesn't hold, touch, or verify money.",
  defaultCurrency: "INR",
  currencySymbol: "₹",
  defaultOverfundingBufferPercent: 10, // allows up to 10% buffer if enabled
  quickChipAmounts: [100, 250, 500, 1000],
  defaultEmojis: ["🎂", "🎉", "🎁", "✨", "🚀", "🍕", "👾", "🕶️", "💖", "🔥"],
};
