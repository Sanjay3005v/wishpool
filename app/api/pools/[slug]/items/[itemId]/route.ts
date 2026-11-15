import { NextRequest, NextResponse } from "next/server";
import { getPoolBySlug, savePool } from "@/lib/db";
import { verifyOwner } from "@/lib/auth";
import { updateItemSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string; itemId: string } }
) {
  try {
    const { slug, itemId } = params;
    const pool = await getPoolBySlug(slug);

    if (!pool) {
      return NextResponse.json({ error: "WishPool not found" }, { status: 404 });
    }

    const isOwner = await verifyOwner(req, pool);
    if (!isOwner) {
      return NextResponse.json({ error: "Unauthorized: Invalid owner key" }, { status: 401 });
    }

    const itemIndex = pool.items.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const currentItem = pool.items[itemIndex];
    const updates = parsed.data;

    pool.items[itemIndex] = {
      ...currentItem,
      ...updates,
      title: updates.title !== undefined ? updates.title : currentItem.title,
      price: updates.price !== undefined ? updates.price : currentItem.price,
      productUrl: updates.productUrl !== undefined ? updates.productUrl : currentItem.productUrl,
      imageUrl: updates.imageUrl !== undefined ? updates.imageUrl : currentItem.imageUrl,
      emoji: updates.emoji !== undefined ? updates.emoji : currentItem.emoji,
      priority: updates.priority !== undefined ? updates.priority : currentItem.priority,
      allowOverfunding:
        updates.allowOverfunding !== undefined ? updates.allowOverfunding : currentItem.allowOverfunding,
    };

    await savePool(pool);

    return NextResponse.json({ success: true, item: pool.items[itemIndex] });
  } catch (error) {
    console.error("Error editing item:", error);
    return NextResponse.json({ error: "Failed to edit item" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string; itemId: string } }
) {
  try {
    const { slug, itemId } = params;
    const pool = await getPoolBySlug(slug);

    if (!pool) {
      return NextResponse.json({ error: "WishPool not found" }, { status: 404 });
    }

    const isOwner = await verifyOwner(req, pool);
    if (!isOwner) {
      return NextResponse.json({ error: "Unauthorized: Invalid owner key" }, { status: 401 });
    }

    pool.items = pool.items.filter((i) => i.id !== itemId);
    // Also remove contributions for this item
    pool.contributions = pool.contributions.filter((c) => c.itemId !== itemId);

    await savePool(pool);

    return NextResponse.json({ success: true, message: "Item deleted" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
