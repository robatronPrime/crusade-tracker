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
  recordOfAchievement: string | string[];
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
  id: string;
  forceId?: string;
  name: string;
  modelCount: number;
  pointsValue: number;
  crusadePoints: number;
  xp: number;
  battlesPlayed: number;
  battlesSurvived: number;
  enemyUnitsDestroyed?: number;
  wargear?: UnitWargear[];
  enhancements?: UnitWargear[];
  battleHonours?: UnitWargear[];
  battleScars?: UnitWargear[];
  type?: string;
};

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
