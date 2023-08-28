import { StatusCodes } from "http-status-codes";
import productModel from "../../../../DB/models/product.model.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cartModel from "../../../../DB/models/cart.model.js";




export const addCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body
    console.log(productId);
    const product = await productModel.findOne({ _id: productId })
    if (!product) {
        return next(new ErrorClass(`This product not Exist!`, StatusCodes.NOT_FOUND))
    }
    if (product.stock < quantity) {
        await productModel.updateOne({ _id: productId }, {
            $addToSet: {
                wishList: req.user._id
            }
        })
        return next(new ErrorClass(`Out Of Stock`, StatusCodes.BAD_REQUEST))
    }
    const cart = await cartModel.findOne({ userId: req.user._id })
    const productIndex = cart.products.findIndex((products => {
        return products.product === productId
    }))
    if (productIndex == -1) {
        cart.products.push({
            productId,
            quantity

        })
    } else {
        cart.products[productIndex].quantity = quantity
    }
    await cart.save()
    return res.status(StatusCodes.CREATED).json({ message: 'Done', cart })
})