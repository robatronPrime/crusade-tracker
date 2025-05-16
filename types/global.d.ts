// types/global.d.ts

import { Document } from "mongoose";

export interface ForceUnit {
  modelCount: number;
  id: number;
  name: string;
  pointsValue: number;
  crusadePoints: number;
}

export interface Force extends Document {
  id: number;
  name: string;
  supplyLimit: number;
  supplyUsed: number;
  battleTally: number;
  victories: number;
  requisitionPoints: number;
  units: ForceUnit[];
  recordOfAchievement: string[]; // or a better type if you know it
}

export interface UnitWargear {
  name: string;
  id: number;
  desc: string;
}

export interface Unit extends Document {
  modelCount: number;
  id: number;
  name: string;
  pointsValue: number;
  crusadePoints: number;
  type: string;
  battlesPlayed: number;
  battlesSurvived: number;
  enemyUnitsDestroyed: number;
  xp: number;
  wargear: UnitWargear[];
  enhancements: UnitWargear[];
  battleHonours: UnitWargear[];
  battleScars: UnitWargear[];
}

export interface UserForceRef {
  forceRef: number;
}

export interface User extends Document {
  clerkID: string;
  userName: string;
  forces: UserForceRef[];
}

type apiResponse = {
  data: any;
  ok: boolean;
  status: number;
  error: string;
};
