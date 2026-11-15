import { NextRequest } from "next/server";
import { BirthdayPool } from "./types";
import { hashSecretKey } from "./utils";

/**
 * Extracts and verifies the secret owner key for a pool
 */
export async function verifyOwner(req: NextRequest, pool: BirthdayPool): Promise<boolean> {
  // Check header first
  const headerKey = req.headers.get("x-owner-key");
  // Or check query parameter
  const { searchParams } = new URL(req.url);
  const queryKey = searchParams.get("key");

  const providedKey = headerKey || queryKey;
  if (!providedKey) return false;

  const hashedProvided = await hashSecretKey(providedKey);
  return hashedProvided === pool.hashedSecretKey;
}
