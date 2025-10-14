import { model, Schema } from 'mongoose';

const WrappedSchema = new Schema({
    recipient: {
        type: String,
        required: true,
        index: true
    }, // wallet address
    wrappedBase64: {
        type: String,
        required: true
    }, // wrapped CEK
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: null        
    }
}, { _id: false });

const FileSchema = new Schema({
    fileId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    owner: {
        type: String,
        required: true
    }, // wallet
    cid: {
        type: String,
        default: null
    }, // IPFS CID after upload
    iv: {
        type: String,
        default: null
    }, // AES-GCM iv (base64)
    metadata: {
        type: Schema.Types.Mixed,
        default: null
    }, // encrypted metadata or info
    wrapped: {
        type: [WrappedSchema],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model('File', FileSchema);
