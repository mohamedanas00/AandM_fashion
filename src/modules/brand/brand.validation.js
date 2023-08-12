import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const addBrand = {
    body: joi.object({
        name: generalFields.name.min(2).max(30).required()
    }).required(),
    file: generalFields.file.required(),
    query: joi.object().required().keys({}),
}


export const updateBrand = {
    params: joi.object({
        id: generalFields.id
    }),
    body: joi.object({
        name: generalFields.name.min(2)
    }).required(),
    file: generalFields.file
}