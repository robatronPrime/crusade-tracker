import { z } from "zod";

export const unitWargearSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  desc: z.string().default(""),
});

export const unitTraitListSchema = z.array(unitWargearSchema).default([]);

export const forceUnitSchema = z.object({
  name: z.string().min(1),
  modelCount: z.number().int().nonnegative(),
  pointsValue: z.number().int().nonnegative(),
  crusadePoints: z.number().int().nonnegative().default(0),
  type: z.string().optional(),
  xp: z.number().int().nonnegative().optional(),
  battlesPlayed: z.number().int().nonnegative().optional(),
  battlesSurvived: z.number().int().nonnegative().optional(),
  enemyUnitsDestroyed: z.number().int().nonnegative().optional(),
  wargear: unitTraitListSchema.optional(),
  enhancements: unitTraitListSchema.optional(),
  battleHonours: unitTraitListSchema.optional(),
  battleScars: unitTraitListSchema.optional(),
});

export const forceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  userId: z.string().min(1),
  victories: z.number().int().nonnegative().optional(),
  units: z.array(forceUnitSchema).optional(),
  supplyLimit: z.number().int().nonnegative().optional(),
  battleTally: z.number().int().nonnegative().optional(),
  requisitionPoints: z.number().int().nonnegative().optional(),
  recordOfAchievement: z.string().optional(),
});

export const addUnitSchema = z.object({
  forceId: z.string().min(1),
  name: z.string().min(1),
  modelCount: z.number().int().nonnegative(),
  pointsValue: z.number().int().nonnegative(),
  crusadePoints: z.number().int().nonnegative().optional(),
  type: z.string().optional(),
  xp: z.number().int().nonnegative().optional(),
  battlesPlayed: z.number().int().nonnegative().optional(),
  battlesSurvived: z.number().int().nonnegative().optional(),
  enemyUnitsDestroyed: z.number().int().nonnegative().optional(),
  wargear: unitTraitListSchema.optional(),
  enhancements: unitTraitListSchema.optional(),
  battleHonours: unitTraitListSchema.optional(),
  battleScars: unitTraitListSchema.optional(),
});

export const updateUnitSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  modelCount: z.number().int().nonnegative(),
  pointsValue: z.number().int().nonnegative(),
  crusadePoints: z.number().int().nonnegative(),
  xp: z.number().int().nonnegative(),
  battlesPlayed: z.number().int().nonnegative(),
  battlesSurvived: z.number().int().nonnegative(),
  enemyUnitsDestroyed: z.number().int().nonnegative().optional(),
  type: z.string().optional(),
  wargear: unitTraitListSchema.optional(),
  enhancements: unitTraitListSchema.optional(),
  battleHonours: unitTraitListSchema.optional(),
  battleScars: unitTraitListSchema.optional(),
});
