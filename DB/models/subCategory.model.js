import { Schema, model } from "mongoose";

const subCategorySchema = Schema({
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
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true, //{TODO}convert to true after creating 
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: false, //{TODO}convert to true after creating 
    }
},
    {
        timestamps: true,
    }
)


const subCategoryModel = model('SubCategory', subCategorySchema)

export default subCategoryModel