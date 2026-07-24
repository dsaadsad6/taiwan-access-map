import { z } from "zod";
import {
  PLACE_CATEGORIES,
  FEATURE_VALUES,
  FLAG_TARGET_TYPES,
  FLAG_REASONS,
} from "./constants";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "密碼至少需要 8 個字元"),
  displayName: z.string().min(1).max(50),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const placeFeatureInputSchema = z.object({
  key: z.string(),
  value: z.enum(FEATURE_VALUES),
  note: z.string().max(500).optional(),
});

export const createPlaceSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(PLACE_CATEGORIES),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().max(200).optional(),
  city: z.string().max(50).optional(),
  description: z.string().max(1000).optional(),
  features: z.array(placeFeatureInputSchema).default([]),
});

export const createReviewSchema = z.object({
  placeId: z.string(),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(1).max(1000),
});

export const createFlagSchema = z
  .object({
    targetType: z.enum(FLAG_TARGET_TYPES),
    placeId: z.string().optional(),
    reviewId: z.string().optional(),
    reason: z.enum(FLAG_REASONS),
    details: z.string().max(500).optional(),
  })
  .refine((data) => (data.targetType === "PLACE" ? !!data.placeId : !!data.reviewId), {
    message: "targetType 與對應的 placeId/reviewId 不一致",
  });

export const resolveFlagSchema = z.object({
  resolution: z.enum(["APPROVE", "REJECT"]),
});
