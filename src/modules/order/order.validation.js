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