import { NextRequest, NextResponse } from "next/server";
import { getPoolBySlug, savePool, checkRateLimit } from "@/lib/db";
import { verifyOwner } from "@/lib/auth";
import { createContributionSchema, updateContributionStatusSchema } from "@/lib/validations";
import { Contribution } from "@/lib/types";
import { calculateItemProgress } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const allowed = await checkRateLimit(ip, "contribute", 20, 60);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many contributions submitted quickly. Please wait a moment." },
        { status: 429 }
      );
    }

    const pool = await getPoolBySlug(slug);
    if (!pool) {
      return NextResponse.json({ error: "WishPool not found" }, { status: 404 });
    }

    if (pool.isClosed) {
      return NextResponse.json({ error: "This WishPool is currently closed." }, { status: 400 });
    }

    const body = await req.json();
    const parsed = createContributionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { itemId, contributorName, isAnonymous, message, amount } = parsed.data;

    const item = pool.items.find((i) => i.id === itemId);
    if (!item) {
      return NextResponse.json({ error: "Wishlist item not found" }, { status: 404 });
    }

    // Check funding limit
    const progress = calculateItemProgress(item, pool.contributions);
    if (progress.isFunded && !item.allowOverfunding) {
      return NextResponse.json(
        { error: "This item is already fully funded! Choose another dream gift." },
        { status: 400 }
      );
    }

    const newContribution: Contribution = {
      id: "contrib_" + Math.random().toString(36).substring(2, 10),
      itemId,
      itemTitle: item.title,
      contributorName: contributorName || "Anonymous Friend",
      isAnonymous: Boolean(isAnonymous),
      message: message || "",
      amount: Number(amount),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    pool.contributions.push(newContribution);
    await savePool(pool);

    return NextResponse.json({
      success: true,
      contribution: {
        id: newContribution.id,
        itemId: newContribution.itemId,
        amount: newContribution.amount,
        status: newContribution.status,
      },
    });
  } catch (error) {
    console.error("Error creating contribution:", error);
    return NextResponse.json({ error: "Failed to record contribution" }, { status: 500 });
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
    const parsed = updateContributionStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { contributionId, status } = parsed.data;
    const contrib = pool.contributions.find((c) => c.id === contributionId);

    if (!contrib) {
      return NextResponse.json({ error: "Contribution not found" }, { status: 404 });
    }

    contrib.status = status;
    await savePool(pool);

    return NextResponse.json({ success: true, contribution: contrib });
  } catch (error) {
    console.error("Error updating contribution:", error);
    return NextResponse.json({ error: "Failed to update contribution status" }, { status: 500 });
  }
}
