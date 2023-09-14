import joi from "joi";
import { generalFields } from "../../middleware/validation.js";



export const addCoupon = {
    params: joi.object().required().keys({}),
    body: joi.object({
        code: joi.string().required(),
        amount: joi.number().positive().required(),
        expireDate: joi.date().required(),
        numberOfUses: joi.number().positive().min(1),
        isPercentage: joi.boolean(),
        isFixedAmount: joi.boolean(),
    }).required(),
    query: joi.object().required().keys({}),
}


export const deleteCoupon = {
    params: joi.object({
        id: generalFields.id,
    }).required(),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}