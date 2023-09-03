import { StatusCodes } from "http-status-codes"
import couponModel from "../../../../DB/models/coupon.model.js"
import { ErrorClass } from "../../../utils/errorClass.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import productModel from "../../../../DB/models/product.model.js"
import cartModel from "../../../../DB/models/cart.model.js"
import orderModel from '../../../../DB/models/order.model.js'
import { isCouponValid } from "../../../utils/couponValidation.js"



// export const addOrder = asyncHandler(async (req, res, next) => {
//     const userId = req.user._id
//     const {
//         productId,
//         quantity,
//         address,
//         phone,
//         note,
//         paymentMethod,
//         couponCode,
//     } = req.body

//     //=================couponId check=================
//     if (couponCode) {
//         const coupon = await couponModel.findOne({ code: couponCode })
//         const isCouponValidR = await isCouponValid({ couponCode, userId, next })
//         if (isCouponValidR !== true) {
//             return isCouponValidR
//         }
//         req.coupon = coupon

//     }
//     //===========product Check=================
//     const products = []
//     const isproductExist
// })


export const OrderFromCart = asyncHandler(async (req, res, next) => {
    const userId = req.user._id
    const {
        address,
        phone,
        note,
        paymentMethod,
        couponCode,
    } = req.body

    const cart = await cartModel.findOne({ userId })
    if (!cart || !cart.products.length) {
        return next(new ErrorClass('Empty Cart!', StatusCodes.CONFLICT))
    }
    //=================couponId check=================
    if (couponCode) {
        const coupon = await couponModel.findOne({ code: couponCode })
        const isCouponValidR = await isCouponValid({ couponCode, userId, next })
        if (isCouponValidR !== true) {
            return isCouponValidR
        }
        req.coupon = coupon
    }
    //============products of order==============
    let orderProducts = []
    let subTotalCart = 0
    for (const product of cart.products) {
        const isproductExist = await productModel.findById(product.productId)
        subTotalCart = subTotalCart + (isproductExist.paymentPrice * product.quantity),
            orderProducts.push({
                product: {
                    name: isproductExist.name,
                    price: isproductExist.price,
                    paymentPrice: isproductExist.paymentPrice * product.quantity,
                    productId: product.productId,
                },
                quantity: product.quantity,
            })
    }

    //=============paid Amount =======
    let paidAmount = 0
    if (req.coupon?.isPercentage) {
        paidAmount = subTotalCart * (1 - (req.coupon.amount || 0) / 100)
    } else if (req.coupon?.isFixedAmount) {
        paidAmount = subTotalCart - req.coupon.amount
    } else {
        paidAmount = subTotalCart
    }
    //================paymentMethod  + orderStatus =====
    let status;
    paymentMethod == 'cash' ? (status = 'placed') : (status = 'pending')
    //================OrderObject========
    const order = await orderModel.create({
        userId,
        products: orderProducts,
        address,
        phone,
        note,
        status,
        paymentMethod,
        subTotal: subTotalCart,
        paiAmount: paidAmount,
        couponId: req.coupon?._id,
    })
    if (order) {
        //============increase usage Count of coupon =====
        console.log("DSADASDSD");
        console.log(req.coupon);
        if (req.coupon) {
            for (const user of req.coupon.usedBy) {
                if (userId.toString() == user.userId.toString()) {
                    user.usageCount += 1
                    break;
                }
            }
            await req.coupon.save()
        }
        //===decrease product's stock by order's product quantity====

        for (const product of cart.products) {
            console.log(product);
            console.log(product.productId);
            await productModel.findOneAndUpdate(
                { _id: product.productId },
                {
                    $inc: { stock: -parseInt(product.quantity) },
                },
            )
        }

        //remove products from userCart if exist
        cart.products = []
        await cart.save()
        res.status(StatusCodes.OK).json({ message: 'Done', order })
    }
    return next(new Error('Fail to create your Order', { cause: 400 }))
})