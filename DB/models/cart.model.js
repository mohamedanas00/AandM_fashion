import { Schema, Types, model } from "mongoose";

const cartSchema = Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [
        {
            productId: {
                type: Types.ObjectId,
                ref: 'product',
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
                required: true,
            },

        }
    ]

})



const cartModel = model('Cart', cartSchema)

export default cartModel