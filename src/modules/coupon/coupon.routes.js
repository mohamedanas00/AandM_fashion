import { Router } from "express";
import * as couponController from './controller/coupon.js'
import auth from "../../middleware/auth.js";
import { userAuth } from "./coupon.endpoint.js";
const couponRouter = Router()


couponRouter.route('/')
    .post(auth(userAuth.Roles), couponController.addCoupon)

couponRouter.route('/:id')
    .delete(auth(userAuth.Roles), couponController.deleteCoupon)
export default couponRouter