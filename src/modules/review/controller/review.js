import { StatusCodes } from "http-status-codes";
import productModel from "../../../../DB/models/product.model.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import orderModel from "../../../../DB/models/order.model.js";
import reviewModel from "../../../../DB/models/review.model.js";




export const addReview = asyncHandler(async (req, res, next) => {
    const { productId, rate, comment } = req.body
    const createdBy = req.user._id
    const isProductExist = await productModel.findById(productId)
    if (!isProductExist) {
        return next(new ErrorClass('Product not found', StatusCodes.NOT_FOUND))
    }
    const order = await orderModel.findOne({
        userId: createdBy,
        status: "deliverd",
        'products.product.productId': productId
    })
    if (!order) {
        return next(new ErrorClass('You cant review this product', StatusCodes.FORBIDDEN))
    }

    const isReviewed = await reviewModel.findOne({
        createdBy,
        productId,
    })
    console.log(isReviewed);
    if (isReviewed) {
        return next(new ErrorClass('You Already review this product', StatusCodes.CONFLICT))
    }
    let rate_ = +rate
    const review = await reviewModel.create({
        createdBy,
        productId,
        rate: rate_,
        comment,
    })
    if (!review) {
        return next(new ErrorClass('try again later ,fail to add your review', StatusCodes.BAD_REQUEST))
    }

    let oldAvg = isProductExist.ratingAvg
    let oldNum = isProductExist.rateCount
    let sum = (oldAvg * oldNum) + rate_
    let reviewsAVG = sum / (oldNum + 1)
    isProductExist.ratingAvg = reviewsAVG
    isProductExist.rateCount = (oldNum + 1)
    isProductExist.save()

    return res.status(StatusCodes.CREATED).json({ message: "Done", review, Rating: reviewsAVG })
})


export const updateReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const createdBy = req.user._id
    const { rate, comment } = req.body


    const isReviewed = await reviewModel.findOne({
        createdBy,
        _id: id,
    })

    if (!isReviewed) {
        return next(new ErrorClass('NO review found to update', StatusCodes.CONFLICT))
    }
    if (rate) {
        let _rate = +rate
        const product = await productModel.findById(isReviewed.productId)
        let oldSum = (product.ratingAvg * product.rateCount) - isReviewed.rate
        let sum = oldSum + _rate
        product.ratingAvg = sum / product.rateCount
        await product.save()
        isReviewed.rate = _rate
    }
    if (comment) {
        isReviewed.comment = comment
    }
    await isReviewed.save

    return res.status(StatusCodes.OK).json({ message: "Done", isReviewed })
})


export const deleteReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const createdBy = req.user._id


    const isReviewed = await reviewModel.findOneAndDelete({
        createdBy,
        _id: id,
    })

    if (!isReviewed) {
        return next(new ErrorClass('NO review found to update', StatusCodes.CONFLICT))
    }
    const product = await productModel.findById(isReviewed.productId)
    let oldSum = (product.ratingAvg * product.rateCount) - isReviewed.rate
    product.ratingAvg = oldSum / (product.rateCount - 1)
    product.rateCount = product.rateCount - 1
    await product.save()

    await isReviewed.save

    return res.status(StatusCodes.OK).json({ message: "Done" })
})