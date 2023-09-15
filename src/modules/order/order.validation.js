import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const OrderFromCart = {
    params: joi.object().required().keys({}),
    body: joi.object({
        address: joi.string().required(),
        phone: joi.string().trim().pattern(/^(010|012|011|015)\d{8}$/),
        note: joi.string(),
        paymentMethod: joi.string().valid('cash', 'card'),
        couponCode: joi.string(),
    }).required(),
    query: joi.object().required().keys({}),
}


export const cancelOrder = {
    params: joi.object({
        id: generalFields.id
    }).required(),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}