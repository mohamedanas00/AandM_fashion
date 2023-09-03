import { Schema, model } from "mongoose";

const orderSchema = Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    products: [
        {
            product: {
                name: { type: String, required: true },
                price: { type: Number, required: true },
                paymentPrice: { type: Number, required: true },
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
            },
            quantity: { type: Number, default: 1, required: true },
        }
    ],
    subTotal: { type: Number, default: 0, required: true },
    paiAmount: { type: Number, default: 0, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String, max: 200 },
    paymentMethod: { type: String, enum: ['cash', 'card'], default: 'card' },
    status: { type: String, enum: ['pending', 'placed', 'deliverd', 'canceled', 'refunded'] },
    couponId: { type: Schema.Types.ObjectId, ref: 'Coupon' }
},
    {
        timestamps: true,
    }
)



const orderModel = model('Order', orderSchema)

export default orderModel