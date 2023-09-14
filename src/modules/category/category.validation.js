import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addCategory = {
    params: joi.object().required().keys({}),
    body: joi.object({
        name: generalFields.name.min(2).required()
    }).required(),
    query: joi.object().required().keys({}),
    file: generalFields.file.required()
}


export const updateCategory = {
    params: joi.object({
        id: generalFields.id
    }),
    body: joi.object({
        name: generalFields.name.min(2)
    }).required(),
    query: joi.object().required().keys({}),
    file: generalFields.file
}



export const getAllCategors = {
    params: joi.object().required().keys({}),
    body: joi.object().required().keys({}),

} 