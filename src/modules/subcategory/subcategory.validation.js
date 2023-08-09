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
    body: joi.object({
        id: generalFields.id
    }).required(),
}