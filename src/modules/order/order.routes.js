import { Router } from "express";
import * as orderController from './controller/order.js'
import auth from "../../middleware/auth.js";
import { userAuth } from "./order.endpoint.js";
import express from "express";
const orderRouter = Router()



orderRouter.route('/')
    .post(auth(userAuth.Roles),
        orderController.OrderFromCart)



orderRouter.post('/webhook',
    express.raw({ type: 'application/json' }),
    orderController.webhook);
export default orderRouter