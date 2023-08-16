import { Schema, model } from "mongoose";

const productSchema = Schema({
    name: {
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
    discount: {
        type: Number,
        default: 0,
        min: 0,
    },
    payementPrice: {
        type: Number,
        default: 0,
        min: 0,
    },
    description: {
        type: String,
        required: true,
        minlength: [10, 'too short description name '],
        maxlength: [300, 'too long description name,description should be less than 100'],
        trim: true//delte space from first and end
    },
    stock: {
        type: Number,
        default: 0,
        min: 0,
    },
    sold: {
        type: Number,
        default: 0,
        min: 0,
    },
    image: {
        type: Object,
        required: true
    },
    coverImages: {
        type: Array
    },
    colors: {
        type: Array
    },
    sizes: {
        type: Array
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
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    subcategoryId: {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true,
    },
    brandId: {
        type: Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: false, //🚩{TODO}convert to true after creating 
    },
    QRcode: {
        type: String,
        required: true
    }
},
    {
        timestamps: true,
    }
)


const productModel = model('Product', productSchema)

export default productModel