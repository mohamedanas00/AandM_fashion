import { StatusCodes } from "http-status-codes"
import couponModel from "../../../../DB/models/coupon.model.js"
import { ErrorClass } from "../../../utils/errorClass.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import productModel from "../../../../DB/models/product.model.js"
import cartModel from "../../../../DB/models/cart.model.js"
import orderModel from '../../../../DB/models/order.model.js'
import { isCouponValid } from "../../../utils/couponValidation.js"
import Stripe from 'stripe';
import CryptoJS from "crypto-js";
import userModel from "../../../../DB/models/user.model.js"
import { cardPayment } from "../../../utils/cardStripPayment.js"
import { invoiceStructure } from "../../../utils/invoiceStructure.js"

const stripe = new Stripe(process.env.STRIP_KEY)


export const OrderFromCart = asyncHandler(async (req, res, next) => {
    const userId = req.user._id
    const {
        address,
        note,
        paymentMethod,
        couponCode,
    } = req.body
    //! if (!req.body.phone) {🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
    //     console.log(req.user.phone);
    //     const incrept = req.user.phone
    //     console.log(CryptoJS.AES.decrypt(incrept, process.env.encrypt_key));
    //     req.body.phone = CryptoJS.AES.decrypt(incrept, process.env.encrypt_key).toString()
    // }
    const cart = await cartModel.findOne({ userId })
    if (!cart || !cart.products.length) {
        return next(new ErrorClass('Empty Cart!', StatusCodes.CONFLICT))
    }
    //*=================couponId check=================
    if (couponCode) {
        const coupon = await couponModel.findOne({ code: couponCode })
        const isCouponValidR = await isCouponValid({ couponCode, userId, next })
        if (isCouponValidR !== true) {
            return isCouponValidR
        }
        req.coupon = coupon
    }
    //*============products of order==============
    let orderProducts = []
    let subTotalCart = 0
    for (const product of cart.products) {
        const isProductExist = await productModel.findById(product.productId)
        subTotalCart = subTotalCart + (isProductExist.paymentPrice * product.quantity),
            orderProducts.push({
                product: {
                    name: isProductExist.name,
                    price: isProductExist.price,
                    paymentPrice: isProductExist.paymentPrice * product.quantity,
                    productId: product.productId,
                    size: product.size,
                    color: product.color,
                },
                quantity: product.quantity,
            })
    }

    //*=============paid Amount ========
    let paidAmount = 0
    if (req.coupon?.isPercentage) {
        paidAmount = subTotalCart * (1 - (req.coupon.amount || 0) / 100)
    } else if (req.coupon?.isFixedAmount) {
        paidAmount = subTotalCart - req.coupon.amount
    } else {
        paidAmount = subTotalCart
    }
    //*================paymentMethod  + orderStatus =====
    let status;
    paymentMethod == 'cash' ? (status = 'placed') : (status = 'waitPayment')
    //*================OrderObject========
    const order = await orderModel.create({
        userId,
        products: orderProducts,
        address,
        phone: req.body.phone,
        note,
        status,
        paymentMethod,
        subTotal: subTotalCart,
        paiAmount: paidAmount,
        couponId: req.coupon?._id,
    })
    if (order) {
        //*============increase usage Count of coupon =====
        if (req.coupon) {
            let flag = true
            for (const user of req.coupon.usedBy) {
                if (userId.toString() == user.userId.toString()) {
                    flag = false
                    user.usageCount += 1
                    break;
                }
            }
            if (flag) {
                req.coupon.usedBy.push({ userId: req.user._id, usageCount: 1 })
            }
            await req.coupon.save()
        }
        //*===decrease product's stock and details quantity====
        for (const product of cart.products) {
            let productFound = await productModel.findOneAndUpdate(
                { _id: product.productId },
                {
                    $inc: { stock: -parseInt(product.quantity) },
                },
                {
                    new: true
                }
            )
            for (let i = 0; i < productFound.details.length; i++) {
                if (productFound.details[i].size == product.size && productFound.details[i].colors.includes(product.color)) {
                    productFound.details[i].quantity -= product.quantity
                    break
                }
            }
            await productFound.save()
        }

        //*remove products from userCart if exist
        cart.products = []
        await cart.save()
        //*card Payment using stripe
        if (paymentMethod == 'card') {
            const session = await cardPayment({ req, stripe, order, next })
            if (session) {
                return res.json({ success: true, results: session.url, order })
            } else {
                return next(new ErrorClass("Session creation failed:", StatusCodes.BAD_REQUEST))
            }
        }
        res.status(StatusCodes.OK).json({ message: 'Done', order })
    }
    //=============Order Fail==========
    return next(new Error('Fail to create your Order', { cause: 400 }))
})



export const webhook = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event = stripe.webhooks.constructEvent(req.body, sig, process.env.END_POINT_SECRETE);
    if (event.type == 'checkout.session.completed') {
        const order = await orderModel.findByIdAndUpdate(
            event.data.object.metadata.orderId,
            {
                status: "placed",
            },
            {
                new: true,
            }
        )
        invoiceStructure(order)
        res.json({ order })
    } else {
        res.json({ message: "invalid payment" })
    }
})


export const cancelOrder = asyncHandler(async (req, res, next) => {
    const userId = req.user._id
    const orderId = req.params.id

    const order = await orderModel.findById(orderId)

    if (order.paymentMethod == 'card' && order.status == 'waitPayment' ||
        order.paymentMethod == 'cash' && order.status != 'delivered') {
        return next(new ErrorClass('this order cannot be canceled', StatusCodes.CONFLICT))
    }

    for (const item of order.products) {
        await productModel.updateOne({
            _id: item.product.productId
        }, {
            $inc: {
                stock: item.quantity
            }
        })
    }

    if (order.couponId) {
        await couponModel.updateOne({
            _id: order.couponId
        }, {
            $pull: {
                usedBy: userId
            }
        }
        )
    }

    order.status = 'canceled'
    await order.save()

    return res.status(StatusCodes.OK).json({ message: done })
})