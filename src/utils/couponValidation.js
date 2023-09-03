import { StatusCodes } from "http-status-codes"
import couponModel from "../../DB/models/coupon.model.js"
import { ErrorClass } from "./errorClass.js"
import { asyncHandler } from "./errorHandling.js"


export const isCouponValid = asyncHandler(async ({ couponCode, userId, next } = {}) => {
    const isCouponExist = await couponModel.findOne({ code: couponCode })
    if (!isCouponExist) {
        return next(new ErrorClass('In-valid Coupon!', StatusCodes.CONFLICT))
    }
    //==expire?or not==
    if (isCouponExist.expireDate < Date.now() || isCouponExist.numberOfUses <= isCouponExist.usedBy.length) {
        return next(new ErrorClass('Expire Coupon!', StatusCodes.BAD_REQUEST))
    }
    //====check the usage of user for coupon
    for (const user of isCouponExist.usedBy) {
        if (userId.toString() == user.userId.toString()) {
            if (isCouponExist.numberOfUses == user.usageCount || isCouponExist.numberOfUses <= user.usageCount) {
                return next(new ErrorClass('Execute Maximum usage Of Coupon!', StatusCodes.BAD_REQUEST))
            }
        }
    }
    return true

})