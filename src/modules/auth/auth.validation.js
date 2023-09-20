import joi from "joi";
import { generalFields } from "../../middleware/validation.js";



export const signUp = {
    params: joi.object().required().keys({}),
    body: joi.object({
        name: generalFields.name.min(3).max(30).required(),
        email: generalFields.email,
        password: generalFields.password.pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).required(),
        cPassword: generalFields.cPassword.valid(joi.ref("password")).required(),
        phone: joi.string().trim().pattern(/^(010|012|011|015)\d{8}$/),
        birthday: joi.date(),
        role:joi.string().valid('admin', 'user').default('user')
    }),
    query: joi.object().required().keys({}),
}

export const confirmEmail = {
    params: joi.object().required().keys({}),
    body: joi.object({
        email: generalFields.email,
        code: joi.string().min(4).max(4).required()
    }),
    query: joi.object().required().keys({}),

}

export const logIn = {
    params: joi.object().required().keys({}),
    body: joi.object({
        email: generalFields.email,
        password: generalFields.password.required()
    }),
    query: joi.object().required().keys({}),
}

export const sendCode = {
    params: joi.object().required().keys({}),
    body: joi.object({
        email: generalFields.email,
    }),
    query: joi.object().required().keys({}),

}

export const restPassword = {
    params: joi.object().required().keys({}),
    body: joi.object({
        email: generalFields.email,
        password: generalFields.password.pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).required(),
        code: joi.string().min(6).max(6).required()
    }),
    query: joi.object().required().keys({}),

}

export const updateProfile={
    params: joi.object().required().keys({}),
    body: joi.object({
        name: generalFields.name.min(3).max(30),
        email: joi.string().email({
            minDomainSegments: 2,
            maxDomainSegments: 4,
            tlds: { allow: ['com', 'net'] }
        }),
        phone: joi.string().trim().pattern(/^(010|012|011|015)\d{8}$/),
        birthday: joi.date(),
    }),
    query: joi.object().required().keys({}),
}

export const deleteAccount={
    params: joi.object().required().keys({}),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}

export const getUserData={
    params: joi.object().required().keys({}),
    body: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
}