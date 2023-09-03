import { Router } from "express";
import * as orderController from './controller/order.js'
import auth from "../../middleware/auth.js";
import { userAuth } from "./order.endpoint.js";
const orderRouter = Router()

orderRouter.route('/')
    .post(auth(userAuth.Roles),
        orderController.OrderFromCart)

export default orderRouter