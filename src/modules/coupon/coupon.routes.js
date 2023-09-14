import { Router } from "express";
import * as couponController from './controller/coupon.js'
import auth from "../../middleware/auth.js";
import { userAuth } from "./coupon.endpoint.js";
import * as validator from './coupon.validation.js'
import { validation } from "../../middleware/validation.js";
const couponRouter = Router()


couponRouter.route('/')
    .post(auth(userAuth.Roles), validation(validator.addCoupon), couponController.addCoupon)

couponRouter.route('/:id')
    .delete(auth(userAuth.Roles), validation(validator.deleteCoupon), couponController.deleteCoupon)
export default couponRouter