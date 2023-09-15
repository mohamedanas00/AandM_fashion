import cartModel from "../models/cart.model.js";
import orderModel from "../models/order.model.js";
import reviewModel from "../models/review.model.js";

export const deleteOne_H= (Schema)=>{
    Schema.post('deleteOne', { document: true, query: false }, async function () {
        await reviewModel.deleteMany({
            createdBy: this._id
        })
        await orderModel.deleteMany({
            userId: this._id
        })
        await cartModel.deleteOne({
            userId: this._id
        })
    })
}

