import { Schema, model } from "mongoose";

const categorySchema = Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        minlength: [2, 'too short category name'],
        trim: true//delete space from first and end
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
        toJSON: { virtuals: true },
        timestamps: true,
    }
)
categorySchema.virtual('Subcategorise', {
    localField: '_id',
    foreignField: 'categoryId',
    ref: 'SubCategory'
})

const categoryModel = model('Category', categorySchema)

export default categoryModel