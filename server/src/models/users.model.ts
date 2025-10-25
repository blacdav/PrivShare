import mongoose, { model, models, Schema } from "mongoose";

export interface IUser {
  email: string;
  passwordHash: string;
  role: "admin" | "user" | "auditor";
  walletAddress?: string; // optional link to wallet
  publicKey?: string;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    walletAddress: {
        type: String
    },
    publicKey: {
        type: String
    }
}, { timestamps: true });

const User = models.User || model<IUser>("User", UserSchema);

export default User