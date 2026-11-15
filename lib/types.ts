export type PriorityType = "must_have" | "nice_to_have";
export type ContributionStatus = "pending" | "confirmed" | "rejected";

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  productUrl?: string;
  imageUrl?: string;
  emoji: string;
  priority: PriorityType;
  allowOverfunding: boolean;
  createdAt: string;
}

export interface Contribution {
  id: string;
  itemId: string;
  itemTitle?: string;
  contributorName: string;
  isAnonymous: boolean;
  message?: string;
  amount: number;
  status: ContributionStatus;
  createdAt: string;
}

export interface BirthdayPool {
  slug: string;
  name: string;
  birthdayDate: string; // YYYY-MM-DD
  upiId: string;
  message?: string;
  avatarEmoji: string;
  themeId: string;
  customAccent?: string;
  hashedSecretKey: string;
  isClosed: boolean;
  createdAt: string;
  items: WishlistItem[];
  contributions: Contribution[];
}

export type PublicBirthdayPool = Omit<BirthdayPool, "hashedSecretKey">;

export interface ItemProgress {
  confirmedAmount: number;
  pendingAmount: number;
  totalTarget: number;
  isFunded: boolean;
  remainingAmount: number;
  confirmedPercent: number;
  pendingPercent: number;
}
