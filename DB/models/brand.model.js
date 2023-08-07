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
    logo: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: false, //🚩{TODO}convert to true after creating 
    }
},
    {
        timestamps: true,
    }
)


const brandModel = model('Brand', brandSchema)

export default brandModel