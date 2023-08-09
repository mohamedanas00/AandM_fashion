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
        secure_url: String,
        public_id: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: false, //🚩{TODO}convert to true after creating 
    }
},
    {
        toJSON: { virtual: true },
        timestamps: true,
    }
)
categorySchema.virtual('Subcategorise', {
    localFiled: '_id',
    forignField: 'categoryId',
    ref: 'Subcategory'
})
const categoryModel = model('Category', categorySchema)

export default categoryModel