import mongoose, { Document, Schema } from "mongoose";

export interface Units extends Document {
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
  wargear: [
    {
      name: string;
      id: number;
      desc: string;
    }
  ];
  enhancements: [
    {
      name: string;
      id: number;
      desc: string;
    }
  ];
  battleHonours: [
    {
      name: string;
      id: number;
      desc: string;
    }
  ];
  battleScars: [
    {
      name: string;
      id: number;
      desc: string;
    }
  ];
}

const unitSchema: Schema = new mongoose.Schema<Units>({
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

export default mongoose.models.Unit || mongoose.model<Units>("Unit", unitSchema);
