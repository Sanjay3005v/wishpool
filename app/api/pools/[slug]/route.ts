import { NextRequest, NextResponse } from "next/server";
import { getPoolBySlug, savePool, deletePool } from "@/lib/db";
import { verifyOwner } from "@/lib/auth";
import { updatePoolSchema } from "@/lib/validations";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const pool = await getPoolBySlug(slug);

    if (!pool) {
      return NextResponse.json({ error: "WishPool not found" }, { status: 404 });
    }

    const isOwner = await verifyOwner(req, pool);

    if (isOwner) {
      // Owner gets full pool data, minus the hashedSecretKey
      const { hashedSecretKey, ...safePool } = pool;
      return NextResponse.json({
        ...safePool,
        isOwner: true,
      });
    }

    // Public visitor gets sanitized data
    // Only confirmed contributions are shown in the public wall of love and progress calculations
    const sanitizedContributions = pool.contributions.map((c) => ({
      id: c.id,
      itemId: c.itemId,
      itemTitle: c.itemTitle,
      contributorName: c.isAnonymous ? "Secret Bestie 🕶️" : c.contributorName,
      isAnonymous: c.isAnonymous,
      message: c.message,
      amount: c.amount,
      status: c.status,
      createdAt: c.createdAt,
    }));

    const publicPool = {
      slug: pool.slug,
      name: pool.name,
      birthdayDate: pool.birthdayDate,
      upiId: pool.upiId,
      message: pool.message,
      avatarEmoji: pool.avatarEmoji,
      themeId: pool.themeId,
      customAccent: pool.customAccent,
      isClosed: pool.isClosed,
      createdAt: pool.createdAt,
      items: pool.items,
      contributions: sanitizedContributions,
      isOwner: false,
    };

    return NextResponse.json(publicPool);
  } catch (error) {
    console.error("Error fetching pool:", error);
    return NextResponse.json({ error: "Failed to fetch pool" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const pool = await getPoolBySlug(slug);

    if (!pool) {
      return NextResponse.json({ error: "WishPool not found" }, { status: 404 });
    }

    const isOwner = await verifyOwner(req, pool);
    if (!isOwner) {
      return NextResponse.json({ error: "Unauthorized: Invalid owner key" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updatePoolSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updates = parsed.data;

    // Apply allowed updates
    if (updates.name !== undefined) pool.name = updates.name;
    if (updates.birthdayDate !== undefined) pool.birthdayDate = updates.birthdayDate;
    if (updates.upiId !== undefined) pool.upiId = updates.upiId;
    if (updates.message !== undefined) pool.message = updates.message;
    if (updates.avatarEmoji !== undefined) pool.avatarEmoji = updates.avatarEmoji;
    if (updates.themeId !== undefined) pool.themeId = updates.themeId;
    if (updates.customAccent !== undefined) pool.customAccent = updates.customAccent;
    if (updates.isClosed !== undefined) pool.isClosed = updates.isClosed;

    await savePool(pool);

    const { hashedSecretKey, ...safePool } = pool;
    return NextResponse.json({ success: true, pool: safePool });
  } catch (error) {
    console.error("Error updating pool:", error);
    return NextResponse.json({ error: "Failed to update pool" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const pool = await getPoolBySlug(slug);

    if (!pool) {
      return NextResponse.json({ error: "WishPool not found" }, { status: 404 });
    }

    const isOwner = await verifyOwner(req, pool);
    if (!isOwner) {
      return NextResponse.json({ error: "Unauthorized: Invalid owner key" }, { status: 401 });
    }

    await deletePool(slug);
    return NextResponse.json({ success: true, message: "Pool deleted" });
  } catch (error) {
    console.error("Error deleting pool:", error);
    return NextResponse.json({ error: "Failed to delete pool" }, { status: 500 });
  }
}
