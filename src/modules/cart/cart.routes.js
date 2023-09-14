import { Router } from "express";
import * as cartController from './controller/cart.js'
import auth from "../../middleware/auth.js";
import { userAuth } from "./cart.endpoint.js";
import * as validator from './cart.validation.js'
import { validation } from "../../middleware/validation.js";
const cartRouter = Router()


cartRouter.route('/')
    .post(auth(userAuth.Roles), validation(validator.addCart), cartController.addCart)
    .get(auth(userAuth.Roles), cartController.getUserCart)



cartRouter.route('/:id')
    .delete(auth(userAuth.Roles), validation(validator.deleteFromeCart), cartController.deleteFromeCart)

export default cartRouter