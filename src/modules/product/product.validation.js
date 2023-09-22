import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addProduct = {
    params: joi.object().required().keys({}),
    body: joi.object({
        name: generalFields.name.min(3).max(20).required(),
        price: joi.number().min(0).required(),
        discount: joi.number().min(0).max(100),
        description: joi.string().min(10).max(300).required(),
        colors: joi.custom((value, helper) => {
            value =JSON.parse(value)
            // Array check
            if (!Array.isArray(value)) {
                return helper.message='value should be array.base'
            }

            // Check if all elements are strings
            for (const color of value) {
                if (typeof color !== 'string') {
                    return helper.message='array.string'

                }

                // Validate each color using a regular expression
                const colorRegex = /^[0-9A-Fa-f]{6}$|^[0-9A-Fa-f]{3}$/;
                if (!color.match(colorRegex)) {
                    return helper.message='array should be hexadecimal color'
                }
            }

            return value;
        }),
        sizes: joi.custom((value,helper)=>{
            value =JSON.parse(value)
            // Array check
            if (!Array.isArray(value)) {
                return helper.message='value should be array.base'
            }

            // Check if all elements are strings
            for (const size of value) {
                if (typeof size !== 'string') {
                    return helper.message='array.string'
                }
            }

            return value;
        }),
        quantity: joi.number().min(1).required(),
        categoryId: generalFields.id,
        subcategoryId: generalFields.id,
        brandId: generalFields.id,
    }).required(),
    file: generalFields.file,
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
        id: generalFields.id
    }).required(),
}

export const getAllProducts = {
    params: joi.object().required().keys({}),
    body: joi.object().required().keys({}),
}