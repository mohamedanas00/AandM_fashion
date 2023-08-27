import joi from "joi";
import { generalFields } from "../../middleware/validation.js";



export const signUp = {
    body: joi.object({
        name: generalFields.name.min(3).max(30).required(),
        email: generalFields.email,
        password: generalFields.password.pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).required(),
        cPassword: generalFields.cPassword.valid(joi.ref("password")).required(),
        phone: joi.string().trim().pattern(/^(010|012|011|015)\d{8}$/).required(),
        birthday: joi.date()
    })
}

export const confirmEmail = {
    body: joi.object({
        email: generalFields.email,
        code: joi.string().min(6).max(6).required()
    })
}

export const logIn = {
    body: joi.object({
        email: generalFields.email,
        password: generalFields.password.required()
    })
}

export const sendCode = {
    body: joi.object({
        email: generalFields.email,
    })
}

export const restPassword = {
    body: joi.object({
        email: generalFields.email,
        password: generalFields.password.pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).required(),
        code: joi.string().min(6).max(6).required()
    })
}

