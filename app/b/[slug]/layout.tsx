import type { Metadata } from "next";
import { getPoolBySlug } from "@/lib/db";
import { APP_CONFIG } from "@/lib/config";
import { daysUntilBirthday } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const pool = await getPoolBySlug(params.slug);

  if (!pool) {
    return {
      title: `WishPool - Not Found`,
      description: "Birthday pool not found",
    };
  }

  const daysLeft = daysUntilBirthday(pool.birthdayDate);
  const countdown =
    daysLeft === 0
      ? "Today is the day! 🎂"
      : daysLeft === 1
      ? "1 day to go! 🔥"
      : `${daysLeft} days to go! ⏰`;

  const title = `${pool.name}'s Birthday Wishlist (${countdown}) - ${APP_CONFIG.name}`;
  const description =
    pool.message ||
    `Chip in money directly via UPI for ${pool.name}'s birthday gifts! No junk, just gifts they actually love.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_IN",
      siteName: APP_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function PoolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
