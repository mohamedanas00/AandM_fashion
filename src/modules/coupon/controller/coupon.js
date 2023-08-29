import { StatusCodes } from "http-status-codes";
import couponModel from "../../../../DB/models/coupon.model.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { asyncHandler } from "../../../utils/errorHandling.js";





export const addCoupon = asyncHandler(async (req, res, next) => {
    const { code, amount, expireDate, numberOfUses } = req.body

    const couponIsExist = await couponModel.findOne({ code })
    if (couponIsExist) {
        return next(new ErrorClass(`This Coupon Already Exist ${couponIsExist}!`, StatusCodes.CONFLICT))
    }

    const cuopon = await couponModel.create({
        code,
        amount,
        expireDate,
        numberOfUses,
        createdBy: req.user._id,
    })

    return res.status(StatusCodes.OK).json({ message: 'Done', cuopon })
})

export const deleteCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const couponIsExist = await couponModel.findByIdAndDelete( id )
    console.log(couponIsExist);
    if (!couponIsExist) {
        return next(new ErrorClass(`This Coupon Not Exist!`, StatusCodes.NOT_FOUND))
    }
    return res.status(StatusCodes.OK).json({ message: 'Done' })
})