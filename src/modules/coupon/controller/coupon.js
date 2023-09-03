import { StatusCodes } from "http-status-codes";
import couponModel from "../../../../DB/models/coupon.model.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { asyncHandler } from "../../../utils/errorHandling.js";





export const addCoupon = asyncHandler(async (req, res, next) => {
    const { code, amount, expireDate, numberOfUses, isPercentage, isFixedAmount } = req.body

    const couponIsExist = await couponModel.findOne({ code })
    if (couponIsExist) {
        return next(new ErrorClass(`This Coupon Already Exist ${couponIsExist}!`, StatusCodes.CONFLICT))
    }
    if ((!isFixedAmount && !isPercentage) || (isFixedAmount && isPercentage)) {
        return next(
            new Error('please select if teh coupon is percentage or fixedAmount', {
                cause: 400,
            }),
        )
    }
    const cuopon = await couponModel.create({
        code,
        amount,
        expireDate,
        numberOfUses,
        isPercentage,
        isFixedAmount,
        createdBy: req.user._id,
    })
    return res.status(StatusCodes.OK).json({ message: 'Done', cuopon })
})

export const deleteCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const couponIsExist = await couponModel.findByIdAndDelete(id)
    console.log(couponIsExist);
    if (!couponIsExist) {
        return next(new ErrorClass(`This Coupon Not Exist!`, StatusCodes.NOT_FOUND))
    }
    return res.status(StatusCodes.OK).json({ message: 'Done' })
})