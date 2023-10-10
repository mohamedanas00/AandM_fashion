import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const addSubcategory = {
    params: joi.object().required().keys({}),
    body: joi.object({
        name: generalFields.name.min(2).max(30).required(),
        categoryId: generalFields.id
    }).required(),
    query: joi.object().required().keys({}),
    file: generalFields.file
}


export const updateSubcategory = {
    params: joi.object({
        id: generalFields.id
    }),
    body: joi.object({
        name: generalFields.name.min(2),
        categoryId: generalFields.id.required()
    }).required(),
    query: joi.object().required().keys({}),
    file: generalFields.file
}

export const getAllSubcategories = {
    params: joi.object().required().keys({}),
    body: joi.object().required().keys({}),
}