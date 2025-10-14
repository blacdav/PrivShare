import mongoose from 'mongoose';

const NonceSchema = new mongoose.Schema({
    nonce: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    } // auto-delete after 5 minutes
});

export default mongoose.model('Nonce', NonceSchema);