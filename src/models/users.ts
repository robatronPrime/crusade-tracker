import mongoose, { Schema } from "mongoose";
import { User } from "../../types/global";

const userSchema: Schema = new mongoose.Schema<User>({
  clerkID: {
    type: String,
    required: true,
    unique: true
  },
  forces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Force"
    }
  ]
});

export default mongoose.models.User || mongoose.model<User>("User", userSchema);
