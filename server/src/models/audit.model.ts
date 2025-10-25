import mongoose, { model, models, Schema } from "mongoose";

export interface IAudit {
  action: string;
  actor: string;
  details?: any;
  timestamp?: Date;
}

const AuditSchema = new Schema<IAudit>({
    action: {
        type: String,
        required: true
    },
    actor: {
        type: String,
        required: true
    },
    details: {
        type: Schema.Types.Mixed
    }
}, { timestamps: true });

const Audit = models.AuditLog || model<IAudit>("AuditLog", AuditSchema);

export default Audit