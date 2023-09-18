import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const addProduct = {
    params: joi.object().required().keys({}),
    body: joi.object({
        name: generalFields.name.min(2).max(30).required(),
        price: joi.number().min(0).required(),
        discount: joi.number().min(0).max(100),
        description: joi.string().max(300).required(),
        colors: joi.array(),
        sizes: joi.array(),
        categoryId: generalFields.id,
        subCategoryId: generalFields.id,
        brandId: generalFields.id,
    }).required(),
    file: generalFields.file.required(),
    query: joi.object().required().keys({}),
}

export const updateProducts = {
    params: joi.object().required().keys({}),
    body: joi.object({
        name: generalFields.name.min(2).max(30),
        price: joi.number().min(0),
        discount: joi.number().min(0),
        description: joi.string().max(300),
        colors: joi.array(),
        sizes: joi.array(),
    }).required(),
    query: joi.object({
        id:generalFields.id
    }).required(),
}

export const getAllProducts = {
    params: joi.object().required().keys({}),
    body: joi.object().required().keys({}),
}