import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BirthdayPool, Contribution, ItemProgress, WishlistItem } from "./types";
import { APP_CONFIG } from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate secure random string for owner secret key
export function generateSecretKey(): string {
  const array = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

// Hash secret key with SHA-256
export async function hashSecretKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key + "_wishpool_salt_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate URL slug from name + random 4-char suffix
export function generateSlug(name: string): string {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 20) || "bday";
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${cleanName}-${randomSuffix}`;
}

// Generate standard UPI Payment URI
export function generateUpiUri(params: {
  vpa: string;
  payeeName: string;
  amount: number;
  note: string;
}): string {
  const cleanVpa = encodeURIComponent(params.vpa.trim());
  const cleanName = encodeURIComponent(params.payeeName.trim().slice(0, 30));
  const amountStr = params.amount.toFixed(2);
  const cleanNote = encodeURIComponent(params.note.trim().slice(0, 40));

  return `upi://pay?pa=${cleanVpa}&pn=${cleanName}&am=${amountStr}&cu=INR&tn=${cleanNote}`;
}

// Calculate days until birthday
export function daysUntilBirthday(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateStr.split("-").map(Number);
  let targetYear = today.getFullYear();
  let targetDate = new Date(targetYear, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  // If birthday already passed this year, check next year
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    // Check if it's within past 2 days to still say belated
    if (diffDays >= -2) {
      return diffDays;
    }
    targetDate = new Date(targetYear + 1, month - 1, day);
    const nextDiffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(nextDiffTime / (1000 * 60 * 60 * 24));
  }

  return diffDays;
}

// Format INR currency
export function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

// Calculate progress for a wishlist item
export function calculateItemProgress(item: WishlistItem, contributions: Contribution[]): ItemProgress {
  const itemContributions = contributions.filter((c) => c.itemId === item.id);
  
  const confirmedAmount = itemContributions
    .filter((c) => c.status === "confirmed")
    .reduce((sum, c) => sum + c.amount, 0);

  const pendingAmount = itemContributions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalTarget = item.price;
  const maxAllowedTarget = item.allowOverfunding
    ? totalTarget * (1 + APP_CONFIG.defaultOverfundingBufferPercent / 100)
    : totalTarget;

  const isFunded = confirmedAmount >= totalTarget;
  const remainingAmount = Math.max(0, maxAllowedTarget - confirmedAmount);

  const confirmedPercent = Math.min(100, Math.round((confirmedAmount / totalTarget) * 100));
  const pendingPercent = Math.min(
    100 - confirmedPercent,
    Math.round((pendingAmount / totalTarget) * 100)
  );

  return {
    confirmedAmount,
    pendingAmount,
    totalTarget,
    isFunded,
    remainingAmount,
    confirmedPercent,
    pendingPercent,
  };
}
