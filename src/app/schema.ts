import { z } from "zod";

export const forceUnitSchema = z.object({
  name: z.string().min(1),
  modelCount: z.number().int().nonnegative(),
  pointsValue: z.number().int().nonnegative(),
  crusadePoints: z.number().int().nonnegative().default(0),
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
});
