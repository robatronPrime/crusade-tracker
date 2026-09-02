type Force = {
  id: string;
  name: string;
  userId: string;
  victories: number;
  units: Unit[];
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
  id: number;
  xp: number;
  type: string;
  unitName: string;
  modelCount: number;
  pointsValue: number;
  crusadePoints: number;
  battlesPlayed: number;
  wargear?: UnitWargear[];
  battlesSurvived: number;
  battleScars?: UnitWargear[];
  enhancements?: UnitWargear[];
  enemyUnitsDestroyed?: number;
  battleHonours?: UnitWargear[];
}

type UserForceRef = {
  forceRef: number;
}

type User = {
  clerkID: string;
  userName: string;
  forces: UserForceRef[];
}

type apiResponse<T> = {
  data: T | null;
  status: number;
  error: boolean;
  message: string;
};

type CreateFormState = {
  message: string;
  success: boolean;
}
