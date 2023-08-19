import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const addSubcategory = {
    body: joi.object({
        name: generalFields.name.min(2).max(30).required(),
        categoryId: generalFields.id
    }).required(),
    file: generalFields.file
}


export const deleteSubCategory = {
    params: joi.object({
        id: generalFields.id
    }).required(),
}

export const updateSubcategory = {
    params: joi.object({
        id: generalFields.id
    }),
    body: joi.object({
        name: generalFields.name.min(2),
        categoryId: generalFields.id.required()
    }).required(),

    file: generalFields.file
}