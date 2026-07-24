import {
  Utensils,
  TrainFront,
  Landmark,
  Trees,
  Store,
  MapPin,
  Check,
  X,
  CircleDot,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import type { PlaceCategory, FeatureValue } from "@/lib/constants";

export const CATEGORY_ICONS: Record<PlaceCategory, LucideIcon> = {
  RESTAURANT: Utensils,
  MRT_STATION: TrainFront,
  TRAIN_STATION: TrainFront,
  GOVERNMENT: Landmark,
  PARK: Trees,
  STORE: Store,
  OTHER: MapPin,
};

export const FEATURE_VALUE_BADGE_VARIANT: Record<
  FeatureValue,
  "success" | "danger" | "warning" | "neutral"
> = {
  YES: "success",
  NO: "danger",
  PARTIAL: "warning",
  UNKNOWN: "neutral",
};

export const FEATURE_VALUE_ICONS: Record<FeatureValue, LucideIcon> = {
  YES: Check,
  NO: X,
  PARTIAL: CircleDot,
  UNKNOWN: HelpCircle,
};
