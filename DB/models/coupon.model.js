import { Schema, model } from "mongoose";
//7mda fdfsf
const couponSchema =new Schema({
    code: { type: String, unique: true, lowercase: true, required: true },
    amount: { type: Number, required: true, min: 0 },
    expireDate: { type: Date, required: true, min: Date.now() },
    numberOfUses: { type: Number, default: 1 },
    isPercentage: { type: Boolean, default: false, required: true },
    isFixedAmount: { type: Boolean, default: false, required: true },
    usedBy: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            usageCount: {
                type: Number,
                default: 0,
            },
        },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

},
    {
        timestamps: true,
    }
)


const couponModel = model('Coupon', couponSchema)

export default couponModel