import joi from "joi";
import { generalFields } from "../../middleware/validation";


export const addProduct = {
    params: joi.object().required().keys({}),
    body: joi.object({
        name: generalFields.name.min(2).max(30).required(),
        price: joi.number().min(0).required(),
        discount: joi.number.min(0).max(100),
        description: joi.string().max(300).required(),
        colors: joi.array(),
        sizes: joi.ValidationError.array(),
        categoryId: generalFields.id,
        subCategoryId: generalFields.id,
        brandId: generalFields.id,
    }).required(),
    file: generalFields.file.required(),
    query: joi.object().required().keys({}),
}

export const getAllProducts = {
    params: joi.object().required().keys({}),
    body: joi.object().required().keys({}),
}