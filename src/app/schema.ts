import {z} from "zod";

export const forceUnitSchema = z.object({
  modelCount: z.number().int().nonnegative(),
  id: z.number().int(),
  name: z.string(),
  pointsValue: z.number().int().nonnegative(),
  crusadePoints: z.number().int().nonnegative(),
});

export const forceSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  victories: z.optional(z.number().int().nonnegative()),
  units: z.optional(z.array(forceUnitSchema)),
  supplyUsed: z.optional(z.number().int().nonnegative()),
  supplyLimit: z.optional(z.number().int().nonnegative()),
  battleTally: z.optional(z.number().int().nonnegative()),
  requisitionPoints: z.optional(z.number().int().nonnegative()),
  recordOfAchievement: z.optional(z.array(z.string())),
});