import joi from "joi";
import { generalFields } from "../../middleware/validation.js";




export const idValidation = {
    body: joi.object().required().keys({}),
    params: joi.object({
        id: generalFields.id
    }),
    query: joi.object().required().keys({}),
}
