import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addProduct = {
    params: joi.object().required().keys({}),
    body: joi.object({
        name: generalFields.name.min(3).max(20).required(),
        price: joi.number().min(0).required(),
        discount: joi.number().min(0).max(100),
        description: joi.string().min(10).max(300).required(),
        details: joi.custom((value, helper) => {
            value = JSON.parse(value)
            // Array check
            if (!Array.isArray(value)) {
                return helper.message = 'value should be array.base'
            }
            const errors = [];
            // Check if all elements are strings
            for (const detail of value) {
                
                if (typeof detail.size!== 'string') {
                    errors.push('size should be a string');
                }

                
                if (typeof detail.quantity !== "number") {
                    errors.push('quantity should be a number');
                }
                
                if (!Array.isArray(detail.quantity)) {
                    errors.push('colors should be an array');
                }

                for (const color of detail.quantity) {
                    const colorRegex = /^[0-9A-Fa-f]{6}$/;
                    if (!color.match(colorRegex)) {
                        errors.push('array colors should be hexadecimal color');
                    }
                }
            }
            if (errors.length > 0) {
                return helper.message = errors.join(', ');
            } 
            return value;
        }).required(),
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