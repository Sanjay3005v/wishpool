import { NextRequest, NextResponse } from "next/server";
import { createPoolSchema } from "@/lib/validations";
import { checkRateLimit, getPoolBySlug, savePool } from "@/lib/db";
import { generateSecretKey, generateSlug, hashSecretKey } from "@/lib/utils";
import { BirthdayPool } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const allowed = await checkRateLimit(ip, "create-pool", 10, 60);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many pools created recently. Please chill for a minute!" },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = createPoolSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, birthdayDate, upiId, message, avatarEmoji, themeId, customAccent } = parsed.data;

    // Generate unique slug
    let slug = generateSlug(name);
    let attempts = 0;
    while ((await getPoolBySlug(slug)) && attempts < 5) {
      slug = generateSlug(name);
      attempts++;
    }

    // Generate secret owner key
    const secretKey = generateSecretKey();
    const hashedSecretKey = await hashSecretKey(secretKey);

    const newPool: BirthdayPool = {
      slug,
      name,
      birthdayDate,
      upiId,
      message: message || "",
      avatarEmoji: avatarEmoji || "🎂",
      themeId: themeId || "hyperpop",
      customAccent,
      hashedSecretKey,
      isClosed: false,
      createdAt: new Date().toISOString(),
      items: [],
      contributions: [],
    };

    await savePool(newPool);

    return NextResponse.json(
      {
        success: true,
        slug,
        secretKey, // Returned only ONCE upon creation!
        pool: {
          slug: newPool.slug,
          name: newPool.name,
          birthdayDate: newPool.birthdayDate,
          upiId: newPool.upiId,
          message: newPool.message,
          avatarEmoji: newPool.avatarEmoji,
          themeId: newPool.themeId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating pool:", error);
    return NextResponse.json({ error: "Failed to create pool" }, { status: 500 });
  }
}
