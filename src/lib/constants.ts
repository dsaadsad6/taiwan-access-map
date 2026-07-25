export const PLACE_CATEGORIES = [
  "RESTAURANT",
  "MRT_STATION",
  "TRAIN_STATION",
  "GOVERNMENT",
  "PARK",
  "STORE",
  "OTHER",
] as const;
export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

export const PLACE_CATEGORY_LABELS: Record<PlaceCategory, string> = {
  RESTAURANT: "餐廳",
  MRT_STATION: "捷運站",
  TRAIN_STATION: "火車/高鐵站",
  GOVERNMENT: "政府機關",
  PARK: "公園",
  STORE: "商店",
  OTHER: "其他",
};

export const MODERATION_STATUSES = ["APPROVED", "PENDING", "REJECTED"] as const;
export type ModerationStatus = (typeof MODERATION_STATUSES)[number];

export const FEATURE_VALUES = ["YES", "NO", "PARTIAL", "UNKNOWN"] as const;
export type FeatureValue = (typeof FEATURE_VALUES)[number];

export const FEATURE_VALUE_LABELS: Record<FeatureValue, string> = {
  YES: "有",
  NO: "沒有",
  PARTIAL: "部分",
  UNKNOWN: "不確定",
};

export const ACCESSIBILITY_FEATURES = [
  { key: "RAMP", labelZh: "無障礙坡道" },
  { key: "ELEVATOR", labelZh: "電梯" },
  { key: "ACCESSIBLE_RESTROOM", labelZh: "無障礙廁所" },
  { key: "ACCESSIBLE_PARKING", labelZh: "無障礙停車位" },
  { key: "STEP_FREE_ENTRANCE", labelZh: "無階梯入口" },
] as const;
export type FeatureKey = (typeof ACCESSIBILITY_FEATURES)[number]["key"];

export const FLAG_TARGET_TYPES = ["PLACE", "REVIEW"] as const;
export type FlagTargetType = (typeof FLAG_TARGET_TYPES)[number];

export const FLAG_REASONS = [
  "INACCURATE",
  "INAPPROPRIATE",
  "SPAM",
  "DUPLICATE",
  "OTHER",
] as const;
export type FlagReason = (typeof FLAG_REASONS)[number];

export const FLAG_REASON_LABELS: Record<FlagReason, string> = {
  INACCURATE: "資訊不正確",
  INAPPROPRIATE: "內容不當",
  SPAM: "廣告/垃圾內容",
  DUPLICATE: "重複地點",
  OTHER: "其他",
};

export const FLAG_STATUSES = ["OPEN", "RESOLVED_APPROVED", "RESOLVED_REJECTED"] as const;
export type FlagStatus = (typeof FLAG_STATUSES)[number];

export const ROLES = ["USER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];
