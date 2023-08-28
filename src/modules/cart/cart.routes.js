import { Router } from "express";
import * as cartController from './controller/cart.js'
import auth from "../../middleware/auth.js";
import { userAuth } from "./cart.endpoint.js";
const cartRouter = Router()


cartRouter.route('/').post(auth(userAuth.Roles), cartController.addCart)

export default cartRouter