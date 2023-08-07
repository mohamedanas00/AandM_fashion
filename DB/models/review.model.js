import { Schema, model } from "mongoose";

const reviewSchema = Schema({
    text: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true//delte space from first and end
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rate: {
        type: Number,
        enum: [1, 2, 3, 4, 5]
    }
},
    {
        timestamps: true,
    }
)


const reviewModel = model('Review', reviewSchema)

export default reviewModel