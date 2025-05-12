import mongoose, { Document, Schema } from "mongoose";

export interface Users extends Document {
  clerkID: string;
  userName: string;
  forces: [
    {
      forceRef: number;
    }
  ];
}

const userSchema: Schema = new mongoose.Schema<Users>({
  clerkID: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  forces: [
    {
      forceRef: {
        type: Number
      }
    }
  ]
});

export default mongoose.models.User || mongoose.model<Users>("User", userSchema);
