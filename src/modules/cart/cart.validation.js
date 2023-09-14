import joi from "joi";
import { generalFields } from "../../middleware/validation.js";



export const addCart = {
    params: joi.object().required().keys({}),
    body: joi.object({
        productId: generalFields.id,
        quantity: joi.number().positive().required()
    }).required(),
    query: joi.object().required().keys({}),
}


export const deleteFromeCart = {
    params: joi.object({
        id: generalFields.id,
    }).required(),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}