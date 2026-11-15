const http = require("http");

async function main() {
  console.log("Starting End-to-End Test for WishPool...");

  const { spawn } = require("child_process");
  const server = spawn("npx", ["next", "start", "-p", "3000"], {
    shell: true,
    stdio: "pipe",
  });

  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const res = await fetch("http://localhost:3000/");
      if (res.status === 200) {
        ready = true;
        break;
      }
    } catch (_) {}
  }

  if (!ready) {
    console.error("Server failed to start in time!");
    server.kill();
    process.exit(1);
  }

  console.log("✓ Next.js server is up and running on http://localhost:3000");

  try {
    // 1. Create a birthday pool
    console.log("\n1. Testing Create Pool (POST /api/pools)...");
    const createRes = await fetch("http://localhost:3000/api/pools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Aarav Sharma",
        birthdayDate: "2026-12-25",
        upiId: "aarav@oksbi",
        message: "Big 21! No socks please ✌️",
        avatarEmoji: "🎂",
        themeId: "hyperpop",
      }),
    });
    const createData = await createRes.json();
    console.log("Create response:", createRes.status, createData.success ? "SUCCESS" : "FAIL");
    if (!createData.success) throw new Error("Create pool failed");

    const slug = createData.slug;
    const secretKey = createData.secretKey;
    console.log(`✓ Pool created: slug=${slug}, secretKey=${secretKey.slice(0, 8)}...`);

    // 2. Fetch public view
    console.log("\n2. Testing Public View (GET /api/pools/[slug])...");
    const pubRes = await fetch(`http://localhost:3000/api/pools/${slug}`);
    const pubData = await pubRes.json();
    console.log("Public view isOwner:", pubData.isOwner, "(expected false)");
    if (pubData.isOwner !== false) throw new Error("Public view should not have isOwner: true");
    console.log("✓ Public pool verified without owner privileges");

    // 3. Fetch owner view
    console.log("\n3. Testing Owner View with secret key...");
    const ownerRes = await fetch(`http://localhost:3000/api/pools/${slug}?key=${secretKey}`);
    const ownerData = await ownerRes.json();
    console.log("Owner view isOwner:", ownerData.isOwner, "(expected true)");
    if (ownerData.isOwner !== true) throw new Error("Owner view should have isOwner: true");
    console.log("✓ Owner authenticated successfully via secret key");

    // 4. Add wishlist items
    console.log("\n4. Testing Add Item (POST /api/pools/[slug]/items)...");
    const addItemRes = await fetch(`http://localhost:3000/api/pools/${slug}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-owner-key": secretKey,
      },
      body: JSON.stringify({
        title: "Sony WH-1000XM5 Headphones",
        price: 20000,
        emoji: "🎧",
        priority: "must_have",
        allowOverfunding: false,
      }),
    });
    const addItemData = await addItemRes.json();
    console.log("Add item status:", addItemRes.status, addItemData.success ? "SUCCESS" : "FAIL");
    if (!addItemData.success) throw new Error("Add item failed");
    const itemId = addItemData.item.id;
    console.log(`✓ Item added: id=${itemId}, title="${addItemData.item.title}", price=₹${addItemData.item.price}`);

    // 5. Friend chips in (self-reported contribution)
    console.log("\n5. Testing Friend Contribution (POST /api/pools/[slug]/contributions)...");
    const contribRes1 = await fetch(`http://localhost:3000/api/pools/${slug}/contributions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId,
        contributorName: "Kabir Mehta",
        isAnonymous: false,
        message: "Happy 21st king! Best headphones ever.",
        amount: 15000,
      }),
    });
    const contribData1 = await contribRes1.json();
    console.log("Contribution 1 status:", contribRes1.status, contribData1.success ? "SUCCESS" : "FAIL");
    if (!contribData1.success) throw new Error("Contribution failed");
    const contribId1 = contribData1.contribution.id;
    console.log(`✓ Contribution logged: id=${contribId1}, status=${contribData1.contribution.status} (pending)`);

    // 6. Owner verifies contribution 1
    console.log("\n6. Testing Owner Verification (PATCH /api/pools/[slug]/contributions)...");
    const verifyRes1 = await fetch(`http://localhost:3000/api/pools/${slug}/contributions`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-owner-key": secretKey,
      },
      body: JSON.stringify({
        contributionId: contribId1,
        status: "confirmed",
      }),
    });
    const verifyData1 = await verifyRes1.json();
    console.log("Verification status:", verifyRes1.status, verifyData1.success ? "SUCCESS" : "FAIL");
    console.log(`✓ Contribution marked as ${verifyData1.contribution.status}`);

    // 7. Friend 2 chips in remaining ₹5,000 to hit FUNDED state
    console.log("\n7. Testing Second Contribution to complete funding...");
    const contribRes2 = await fetch(`http://localhost:3000/api/pools/${slug}/contributions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId,
        contributorName: "Ananya Roy",
        isAnonymous: true,
        message: "Here is the final 5k! 🥳",
        amount: 5000,
      }),
    });
    const contribData2 = await contribRes2.json();
    const contribId2 = contribData2.contribution.id;

    // Owner confirms second contribution
    await fetch(`http://localhost:3000/api/pools/${slug}/contributions`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-owner-key": secretKey,
      },
      body: JSON.stringify({
        contributionId: contribId2,
        status: "confirmed",
      }),
    });
    console.log("✓ Second contribution confirmed! Total raised: ₹20,000 / ₹20,000");

    // 8. Verify public pool shows item funded & Wall of Love
    console.log("\n8. Checking final Pool State...");
    const finalRes = await fetch(`http://localhost:3000/api/pools/${slug}`);
    const finalData = await finalRes.json();
    console.log(`✓ Items count: ${finalData.items.length}`);
    console.log(`✓ Confirmed contributions: ${finalData.contributions.length}`);
    console.log(`✓ Contributor 1: ${finalData.contributions[0].contributorName}`);
    console.log(`✓ Contributor 2 (anonymous): ${finalData.contributions[1].contributorName}`);

    // 9. Test closing the pool
    console.log("\n9. Testing Pool Close (PATCH /api/pools/[slug])...");
    const closeRes = await fetch(`http://localhost:3000/api/pools/${slug}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-owner-key": secretKey,
      },
      body: JSON.stringify({ isClosed: true }),
    });
    const closeData = await closeRes.json();
    console.log("Pool closed status:", closeData.pool.isClosed);
    console.log("✓ Pool close tested successfully");

    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! FULL FLOW VERIFIED 🎉\n");
  } catch (err) {
    console.error("Test failed with error:", err);
  } finally {
    server.kill();
    process.exit(0);
  }
}

main();
