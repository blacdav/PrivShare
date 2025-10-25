import mongoose, { model, Schema, Types } from "mongoose";
import { models } from "mongoose";

export interface IFile {
  fileId: string; // bytes32 hex string
  owner: Types.ObjectId; // user id
  ipfsHash: string;
  encryptedKey?: string; // AES key encrypted with owner's public key
  metadata?: Record<string, any>;
  createdAt?: Date;
}

const FileSchema = new Schema<IFile>({
    fileId: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ipfsHash: {
        type: String,
        required: true
    },
    encryptedKey: {
        type: String
    },
    metadata: {
        type: Schema.Types.Mixed
    }
}, { timestamps: true });

const File = models.File || model<IFile>("File", FileSchema);

export default File