type ForceUnit = {
  modelCount: number;
  id: number;
  name: string;
  pointsValue: number;
  crusadePoints: number;
}

type Force = {
  id: string;
  name: string;
  userId: string;
  victories: number;
  units: ForceUnit[];
  supplyUsed: number;
  supplyLimit: number;
  battleTally: number;
  requisitionPoints: number;
  recordOfAchievement: string[]; // or a better type if you know it
}

type CrusadeUser = {
  _id: string;
  forces: Force[];
  clerkID: string;
}

type UnitWargear = {
  name: string;
  id: number;
  desc: string;
}

type Unit = {
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

type UserForceRef = {
  forceRef: number;
}

type User = {
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

type CreateFormState = {
  message: string;
  success: boolean;
}
