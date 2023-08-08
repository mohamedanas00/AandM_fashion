import { Schema, model } from "mongoose";

const categorySchema = Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        minlength: [2, 'too short category name'],
        trim: true//delte space from first and end
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: {
        secure_url: {
            type: String,
            required: false//🚩
        },
        public_id: {
            type: String,
            required: false//🚩
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

const categoryModel = model('Category', categorySchema)

export default categoryModel