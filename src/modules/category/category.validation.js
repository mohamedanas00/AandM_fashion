import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addCategory = {
    body: joi.object({
        name: generalFields.name.min(2).required()
    }).required(),
    file: generalFields.file.required()
}


export const updateCategory = {
    params: joi.object({
        id: generalFields.id
    }),
    body: joi.object({
        name: generalFields.name.min(2)
    }).required(),
    file: generalFields.file
} 