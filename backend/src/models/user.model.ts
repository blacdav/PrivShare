import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    wallet: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    encPubKey: {
        type: String,
        default: null
    }, // base64 X25519 public key
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
