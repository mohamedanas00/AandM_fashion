import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const updateProfile = {
  params: joi.object().required().keys({}),
  body: joi.object({
    name: generalFields.name.min(3).max(30),
    email: joi
      .string()
      .pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)),
    phone: joi
      .string()
      .trim()
      .pattern(/^(010|012|011|015)\d{8}$/),
    birthday: joi.date(),
  }),
  query: joi.object().required().keys({}),
};

export const addToFavorite = {
  params: joi
    .object({
      id: generalFields.id,
    })
    .required(),
  body: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};

export const basic = {
  params: joi.object().required().keys({}),
  body: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};
