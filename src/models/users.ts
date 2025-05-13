import mongoose, { Schema } from "mongoose";
import { User } from "../../types/global";

const userSchema: Schema = new mongoose.Schema<User>({
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

export default mongoose.models.User || mongoose.model<User>("User", userSchema);
