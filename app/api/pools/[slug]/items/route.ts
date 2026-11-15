import { NextRequest, NextResponse } from "next/server";
import { getPoolBySlug, savePool } from "@/lib/db";
import { verifyOwner } from "@/lib/auth";
import { createItemSchema } from "@/lib/validations";
import { WishlistItem } from "@/lib/types";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
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
    const parsed = createItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newItem: WishlistItem = {
      id: "item_" + Math.random().toString(36).substring(2, 10),
      title: parsed.data.title,
      price: parsed.data.price,
      productUrl: parsed.data.productUrl || undefined,
      imageUrl: parsed.data.imageUrl || undefined,
      emoji: parsed.data.emoji || "🎁",
      priority: parsed.data.priority,
      allowOverfunding: parsed.data.allowOverfunding,
      createdAt: new Date().toISOString(),
    };

    pool.items.push(newItem);
    await savePool(pool);

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error) {
    console.error("Error adding item:", error);
    return NextResponse.json({ error: "Failed to add wishlist item" }, { status: 500 });
  }
}
