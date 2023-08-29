import { Schema, model } from "mongoose";

const couponSchema = Schema({
    code: { type: String, unique: true, lowercase: true, required: true },
    amount: { type: Number, required: true, min: 0 },
    expireDate: { type: Date, required: true, min: Date.now() },
    numberOfUses: { type: Number, required: true },
    usedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
},
    {
        timestamps: true,
    }
)


const couponModel = model('Coupon', couponSchema)

export default couponModel