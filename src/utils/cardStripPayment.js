import { StatusCodes } from "http-status-codes";
import { ErrorClass } from "./errorClass.js";


export const cardPayment = (async ({ req, stripe, order , next } = {}) => {
    let couponStrip
    if (req.coupon) {
        couponStrip = await stripe.coupons.create({
            percent_off: req.coupon.amount,
            duration: "once"
        })
    }
    //================strip payment=========
    try {
        var session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            metadata: {
                orderId: order._id.toString()
            },
            success_url: process.env.SUCCESS_URL,
            cancel_url: process.env.CANCEL_URL,
            //return new array
            line_items:
                order.products.map((iteration) => {
                    return {
                        price_data: {
                            currency: 'EGP',
                            product_data: {
                                name: iteration.product.name,
                                // images: ['https://example.com/t-shirt-image.jpg'], // Optional images
                            },
                            unit_amount: iteration.product.paymentPrice * 100,
                        },
                        quantity: iteration.quantity,
                    }
                }),

            discounts: couponStrip ? [{ coupon: couponStrip.id }] : [],

        })
    }catch(error){
        return next (new ErrorClass("Error creating session:",StatusCodes.BAD_REQUEST))
    }
    return session
})