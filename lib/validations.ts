import { z } from "zod";

// UPI VPA Regex: e.g. user@okhdfcbank, 9876543210@paytm, name.surname@axisbank
export const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

export function sanitizeText(str: string): string {
  return str
    .replace(/[<>]/g, "") // basic tag strip
    .trim();
}

export const createPoolSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name is too long")
    .transform(sanitizeText),
  birthdayDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  upiId: z
    .string()
    .min(3, "UPI ID is required")
    .regex(upiRegex, "Invalid UPI ID format (e.g. name@bank or number@paytm)"),
  message: z.string().max(280, "Message too long").optional().transform((v) => (v ? sanitizeText(v) : "")),
  avatarEmoji: z.string().min(1).max(10).default("🎂"),
  themeId: z.string().default("hyperpop"),
  customAccent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color").optional(),
});

export const updatePoolSchema = z.object({
  name: z.string().min(1).max(50).transform(sanitizeText).optional(),
  birthdayDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  upiId: z.string().regex(upiRegex).optional(),
  message: z.string().max(280).transform(sanitizeText).optional(),
  avatarEmoji: z.string().min(1).max(10).optional(),
  themeId: z.string().optional(),
  customAccent: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  isClosed: z.boolean().optional(),
});

export const createItemSchema = z.object({
  title: z
    .string()
    .min(1, "Item title is required")
    .max(80, "Item title too long")
    .transform(sanitizeText),
  price: z.coerce.number().positive("Price must be greater than 0").max(10000000, "Price is too large"),
  productUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  imageUrl: z
    .string()
    .url("Must be a valid image URL")
    .optional()
    .or(z.literal("")),
  emoji: z.string().min(1).max(10).default("🎁"),
  priority: z.enum(["must_have", "nice_to_have"]).default("must_have"),
  allowOverfunding: z.boolean().default(false),
});

export const updateItemSchema = createItemSchema.partial();

export const createContributionSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  contributorName: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name is too long")
    .transform(sanitizeText),
  isAnonymous: z.boolean().default(false),
  message: z
    .string()
    .max(200, "Message too long")
    .optional()
    .transform((v) => (v ? sanitizeText(v) : "")),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
});

export const updateContributionStatusSchema = z.object({
  contributionId: z.string().min(1),
  status: z.enum(["confirmed", "rejected", "pending"]),
});
