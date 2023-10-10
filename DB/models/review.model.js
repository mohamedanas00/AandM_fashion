import { Schema, model } from "mongoose";

const reviewSchema =new Schema({
    comment: { type: String, lowercase: true, required: true, trim: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rate: { type: Number, min: 0, max: 5, required: true }
},
    {
        timestamps: true,
    }
)


const reviewModel = model('Review', reviewSchema)

export default reviewModel