import express,{ Router } from "express";
import * as orderController from './controller/order.js'
import auth from "../../middleware/auth.js";
import { userAuth } from "./order.endpoint.js";
import * as validator from './order.validation.js'
import { validation } from "../../middleware/validation.js";
const orderRouter = Router()



orderRouter.route('/')
    .post(auth(userAuth.Roles),
        validation(validator.OrderFromCart),
        orderController.OrderFromCart)

orderRouter.route('/:id')
    .delete(auth(userAuth.Roles), validation(validator.cancelOrder),
        orderController.cancelOrder)


orderRouter.post('/webhook',
    express.raw({ type: 'application/json' }),
    orderController.webhook);

    
export default orderRouter