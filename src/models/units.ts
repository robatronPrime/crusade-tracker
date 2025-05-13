import mongoose, { Schema } from "mongoose";
import { Unit } from "../../types/global";

const unitSchema: Schema = new mongoose.Schema<Unit>({
  modelCount: {
    type: Number,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  pointsValue: {
    type: Number
  },
  crusadePoints: {
    type: Number
  },
  type: {
    type: String
  },
  battlesPlayed: {
    type: Number
  },
  battlesSurvived: {
    type: Number
  },
  enemyUnitsDestroyed: {
    type: Number
  },
  xp: {
    type: Number
  },
  wargear: [
    {
      name: {
        type: String
      },
      id: {
        type: Number
      },
      desc: {
        type: String
      }
    }
  ],
  enhancements: [
    {
      name: {
        type: String
      },
      id: {
        type: Number
      },
      desc: {
        type: String
      }
    }
  ],
  battleHonours: [
    {
      name: {
        type: String
      },
      id: {
        type: Number
      },
      desc: {
        type: String
      }
    }
  ],
  battleScars: [
    {
      name: {
        type: String
      },
      id: {
        type: Number
      },
      desc: {
        type: String
      }
    }
  ]
});

export default mongoose.models.Unit || mongoose.model<Unit>("Unit", unitSchema);
