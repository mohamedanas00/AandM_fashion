import { Schema, model } from "mongoose";

const brandSchema = Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true//delte space from first and end
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: {
        secure_url: String,
        public_id: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},
    {
        timestamps: true,
    }
)


const brandModel = model('Brand', brandSchema)

export default brandModel