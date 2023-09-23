import { StatusCodes } from "http-status-codes"
import userModel from "../../../../DB/models/user.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import { ErrorClass } from "../../../utils/errorClass.js"
import CryptoJS from "crypto-js";
import productModel from '../../../../DB/models/product.model.js'



export const deleteAccount = asyncHandler(async (req, res, next) => {
    const userId = req.user._id
    const user = new userModel({ _id: userId })
    await user.deleteOne({ _id: userId })
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done" })
})

export const updateProfile = asyncHandler(async (req, res, next) => {
    let { name, email, phone, birthday } = req.body
    const id = req.user._id
    if (email) {
        const isEmailExist = await userModel.findOne({ email: req.body.email })
        if (isEmailExist) {
            return next(new ErrorClass(`This email:"${req.body.email}" Already Exist!`, StatusCodes.CONFLICT))
        }
    }
    if (phone) {
        phone = CryptoJS.AES.encrypt(phone, process.env.encrypt_key).toString()
    }
    await userModel.updateOne({ _id: id }, {
        name,
        email,
        phone,
        birthday
    })
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done" })

})

export const getUserData = asyncHandler(async (req, res, next) => {
    if (req.user.phone) {
        req.user.phone = CryptoJS.AES.decrypt(req.user.phone, process.env.encrypt_key).toString(CryptoJS.enc.Utf8);
    }
    return res.status(StatusCodes.OK).json({
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        birthday: req.user.birthday
    })
})

export const addToFavourite = asyncHandler(async (req, res, next) => {
    const userId = req.user._id
    const { id } = req.params
    const isProductExist = await productModel.findById(id)

    if (!isProductExist) {
        return next(new ErrorClass(StatusCodes.NOT_FOUND, "productId not found!"))
    }
    await userModel.updateOne({ _id: userId }, {
        $push: {
            favouriteProducts: id
        }
    })
    return res.status(StatusCodes.OK).json({ message: "Done" })
})

export const getFavouriteProducts = asyncHandler(async (req, res, next) => {
    const userId = req.user._id
    const result = await userModel.findById(userId).populate({
        path:'favouriteProducts',
        select:'-wishList -__v -slug'
    })
    return res.status(StatusCodes.OK).json({message:"Done",'Favourite Products❤️':result.favouriteProducts})
})