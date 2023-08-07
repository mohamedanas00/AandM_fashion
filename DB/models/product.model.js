import { Schema, model } from "mongoose";

const productSchema = Schema({
    title: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        minlength: [10, 'too short category name'],
        trim: true//delte space from first and end
    },
    slug: {
        type: String,
        lowercase: true,
    },
    price: {
        type: Number,
        default: 0,
        min: 0,
    },
    priceAfterDiscound: {
        type: Number,
        default: 0,
        min: 0,
    },
    description: {
        type: String,
        required: true,
        minlength: [10, 'too short description name '],
        maxlength: [100, 'too long description name,description should be less than 100'],
        trim: true//delte space from first and end
    },
    stock: {
        type: Number,
        default: 0,
        min: 0,
    },
    soldItem: {
        type: Number,
        default: 0,
        min: 0,
    },
    imageCover: {
        type: String, //{TOD}🚩
    },
    ratingAvg: {
        type: Number,
        max: 5,
        min: 1,
    },
    rateCount: {
        type: Number,
        min: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true,
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
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


const productModel = model('Product', productSchema)

export default productModel