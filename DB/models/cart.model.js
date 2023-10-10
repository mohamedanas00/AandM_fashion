import { Schema, model } from "mongoose";

const cartSchema =new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', unique: true, required: true },
    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, },
            quantity: { type: Number, default: 1, required: true, },
            size: { type: String, required: true },
            color: { type: String, required: true }
        }
    ]

},
    {
        timestamps: true,
    }
)



const cartModel = model('Cart', cartSchema)

export default cartModel