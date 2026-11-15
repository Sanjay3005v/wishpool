# 🎂 WishPool

> **Group-fund birthday dreams via UPI. No junk, no drama, pure vibes.**

A small, fun, Gen-Z neo-brutalist web app where birthday people create a wishlist and friends chip in money together for gifts directly via UPI, instead of everyone buying random mugs and socks.

---

## ✨ Features

- **⚡ Zero Accounts, 100% Frictionless**: No signup, no passwords. Birthday person gets a public share link (`/b/[slug]`) and a secret owner link (`/b/[slug]?key=SECRET`).
- **💸 Direct UPI Payments (0% Gateway Fees)**: No Razorpay, no Stripe, no money held. Friends scan client-side generated QR codes or click mobile UPI deep-links directly to the birthday person's VPA.
- **📊 Real-time Neo-brutalist Progress**: Dual-layer progress bar displaying confirmed received funds (solid color) and pending verifications (striped pattern).
- **🎉 Confetti & Funded State**: Items automatically flip to "FUNDED 🎉" with confetti bursts when the target is reached, with optional overfunding buffer (+10%).
- **💌 Wall of Love**: Friends leave sweet messages or wholesome roasts alongside their contributions (with an optional "Stay mysterious 🕶️" anonymous toggle).
- **🎨 4 Gen-Z Aesthetics**:
  - **Hyperpop**: Hot pink + neon lime
  - **Lo-fi Sunset**: Sunset orange + retro lilac
  - **Matcha Mode**: Sage green + whipped cream
  - **Dark Mode Chaos**: Pitch black + toxic neon
- **📱 Mobile-First**: Crafted specifically for WhatsApp links and 375px mobile viewports.
- **🖼️ Dynamic Open Graph Preview**: Generates rich WhatsApp previews with live countdown and birthday person's emoji avatar.

---

## 🛠️ Tech Stack & Constraints

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (Neo-brutalist design with custom CSS theme variables)
- **Database**: Upstash Redis via `@upstash/redis` (Clean abstraction in `lib/db.ts` with local fallback for offline dev)
- **QR Code**: Client-side SVG generation via `qrcode.react`
- **Validation**: Strict server and client-side validation with `zod`
- **Deployment**: 100% compatible with Vercel's **FREE Hobby tier** (Serverless Route Handlers, no persistent servers)

---

## 🚀 Step-by-Step Vercel Deployment Guide

### Step 1: Push Code to GitHub
1. Create a new repository on [GitHub](https://github.com).
2. Initialize git and push:
```bash
git init
git add .
git commit -m "feat: initial commit of WishPool"
git branch -M main
git remote add origin https://github.com/<your-username>/wishpool.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." → "Project"**.
2. Select your `wishpool` GitHub repository and click **Import**.
3. Framework Preset will be automatically detected as **Next.js**.

### Step 3: Create Free Upstash Redis Database (via Vercel Marketplace)
1. On the Vercel project configuration page (or under the **Storage** tab in your dashboard):
   - Click **"Storage"** in the top navigation or marketplace.
   - Select **Upstash Redis** (Available on the free tier).
   - Click **Connect Store** to attach it to your WishPool project.
2. Vercel will automatically inject:
   - `KV_REST_API_URL` (or `UPSTASH_REDIS_REST_URL`)
   - `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_TOKEN`)

*(Alternatively, if using [Upstash.com](https://console.upstash.com) directly: create a free Redis database, copy the REST URL and REST Token, and paste them into Vercel's Environment Variables).*

### Step 4: Configure Environment Variables
Under **Environment Variables** in Vercel, ensure you have:
| Variable | Value | Description |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | `https://...upstash.io` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | `...` | Upstash Redis REST Token |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Your Vercel deployment URL |

### Step 5: Deploy!
Click **Deploy**. Your app will build and go live in ~1 minute on your `.vercel.app` domain!

---

## 💻 Local Development & Testing

WishPool includes an **automatic local storage fallback** in `lib/db.ts`. You can run and test the full application locally even without configuring Redis!

1. Clone and install dependencies:
```bash
npm install
```

2. Start the local development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 File Structure

```
├── app/
│   ├── api/
│   │   └── pools/
│   │       ├── route.ts                 # POST /api/pools (create pool)
│   │       └── [slug]/
│   │           ├── route.ts             # GET, PATCH, DELETE /api/pools/[slug]
│   │           ├── items/
│   │           │   ├── route.ts         # POST /api/pools/[slug]/items
│   │           │   └── [itemId]/route.ts# PATCH, DELETE item
│   │           └── contributions/
│   │               └── route.ts         # POST (contribute), PATCH (verify)
│   ├── b/[slug]/
│   │   ├── page.tsx                     # Public wishlist & private owner dashboard
│   │   ├── layout.tsx                   # Dynamic metadata generator
│   │   └── opengraph-image.tsx          # Dynamic OG preview image (Next.js ImageResponse)
│   ├── create/
│   │   └── page.tsx                     # Pool creation form & secret key reveal
│   ├── globals.css                      # Neo-brutalist CSS variables & utility classes
│   ├── layout.tsx                       # Root layout & viewport
│   └── page.tsx                         # Landing page with interactive demo & how-it-works
├── components/
│   ├── AddItemModal.tsx                 # Modal for owner to add gifts
│   ├── EditItemModal.tsx                # Modal for owner to edit gifts
│   ├── EditPoolModal.tsx                # Modal for owner pool settings & theme switcher
│   ├── ChipInModal.tsx                  # Friend contribution modal with QR & UPI app button
│   ├── Confetti.ts                      # Canvas-confetti celebration triggers
│   ├── Footer.tsx                       # Footer with disclaimer
│   ├── ItemCard.tsx                     # Neo-brutalist wishlist card
│   ├── Navbar.tsx                       # App header
│   ├── OwnerDashboard.tsx               # Owner verification dashboard
│   ├── ProgressBar.tsx                  # Dual-state progress bar (confirmed vs pending)
│   ├── ThemeWrapper.tsx                 # Dynamic CSS variable injector
│   └── WallOfLove.tsx                   # Contributor feed with messages
├── lib/
│   ├── auth.ts                          # Secret key hashing & owner verification
│   ├── config.ts                        # Global app settings (app name "WishPool", defaults)
│   ├── copy.ts                          # Casual Gen-Z copy & meme-y strings
│   ├── db.ts                            # Clean DB layer: Upstash Redis with local fallback
│   ├── themes.ts                        # 4 Neo-brutalist theme presets
│   ├── types.ts                         # TypeScript interfaces
│   ├── utils.ts                         # UPI URI generator, currency format, daysUntil, etc.
│   └── validations.ts                   # Zod schemas for all inputs
├── .env.example
├── package.json
└── README.md
```

---

## 🔒 Security & Privacy

- **Hashed Secret Keys**: Owner secret keys are generated using cryptographically strong random values (`crypto.randomUUID`/`getRandomValues`), stored only as SHA-256 hashes, and never returned in public API responses.
- **Zero Financial Holding**: Payments go directly peer-to-peer over the UPI network between the contributor and birthday recipient.
- **Input Sanitization**: User-submitted texts and messages are sanitized with tag-stripping and validated via Zod.
- **Rate Limiting**: Built-in write endpoint protection per IP.
