import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const addReview = {
    params: joi.object().required().keys({}),
    body: joi.object({
        productId: generalFields.id,
        rate: joi.number().min(0).max(5).required(),
        comment: joi.string().required(),
    }).required(),
    query: joi.object().required().keys({}),
}


export const updateReview = {
    params: joi.object({
        id: generalFields.id,
    }).required(),
    body: joi.object({
        rate: joi.number().min(0).max(5),
        comment: joi.string(),
    }).required(),
    query: joi.object().required().keys({}),
}

export const deleteReview = {
    params: joi.object({
        id: generalFields.id,
    }).required(),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}