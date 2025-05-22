import mongoose, { Schema } from "mongoose";
import { Force } from "../../types/global";

const forceSchema: Schema = new mongoose.Schema<Force>({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  supplyLimit: {
    type: Number,
    required: true
  },
  supplyUsed: {
    type: Number,
    required: true
  },
  battleTally: {
    type: Number,
    required: true
  },
  victories: {
    type: Number
  },
  requisitionPoints: {
    type: Number
  },
  units: [
    {
      id: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      pointsValue: {
        type: Number,
        required: true
      },
      crusadePoints: {
        type: Number
      },
      modelCount: {
        type: Number
      }
    }
  ],
  recordOfAchievement: {
    type: []
  }
});

export default mongoose.models.Force || mongoose.model<Force>("Force", forceSchema);
