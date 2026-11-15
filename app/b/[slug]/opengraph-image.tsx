import { ImageResponse } from "next/og";
import { getPoolBySlug } from "@/lib/db";
import { daysUntilBirthday, formatINR } from "@/lib/utils";

export const runtime = "nodejs";

export const alt = "WishPool Birthday Page Preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const pool = await getPoolBySlug(params.slug);

  const name = pool?.name || "Birthday Legend";
  const avatar = pool?.avatarEmoji || "🎂";
  const itemsCount = pool?.items.length || 0;
  const daysLeft = pool ? daysUntilBirthday(pool.birthdayDate) : 0;
  const daysText =
    daysLeft === 0
      ? "TODAY IS THE DAY! 🎂"
      : daysLeft === 1
      ? "1 DAY TO GO! 🔥"
      : `${daysLeft} DAYS TO GO! ⏰`;

  const totalGoal = pool?.items.reduce((sum, item) => sum + item.price, 0) || 0;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FFF0F5",
          padding: 60,
          border: "16px solid #000000",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: "#FF2E93",
                border: "4px solid #000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              🎂
            </div>
            <span
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#000000",
              }}
            >
              WishPool
            </span>
          </div>

          <div
            style={{
              padding: "10px 24px",
              backgroundColor: "#A6FF00",
              border: "4px solid #000000",
              borderRadius: 30,
              fontSize: 22,
              fontWeight: 900,
              color: "#000000",
            }}
          >
            {daysText}
          </div>
        </div>

        {/* Center Main Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            backgroundColor: "#FFFFFF",
            padding: 40,
            borderRadius: 24,
            border: "6px solid #000000",
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 24,
              backgroundColor: "#A6FF00",
              border: "6px solid #000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 80,
            }}
          >
            {avatar}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#FF2E93",
                textTransform: "uppercase",
              }}
            >
              Official Birthday Wishlist 🎁
            </span>
            <span
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: "#000000",
                lineHeight: 1.1,
              }}
            >
              {name}&apos;s Birthday
            </span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#4B5563",
              }}
            >
              {itemsCount} dream gift{itemsCount === 1 ? "" : "s"} listed &bull; Chip in directly via UPI!
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            fontWeight: 800,
            color: "#000000",
          }}
        >
          <span>💸 Direct UPI to {name} &bull; No Gateway Fees</span>
          <span
            style={{
              padding: "8px 20px",
              backgroundColor: "#FF2E93",
              color: "#FFFFFF",
              border: "3px solid #000000",
              borderRadius: 14,
            }}
          >
            Chip in 💸
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
