import userModel from "../../../../DB/models/user.model.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import CryptoJS from "crypto-js";
import { hash, compare } from "../../../utils/hashing.js";
import { StatusCodes } from "http-status-codes";
import { sendEmail, emailHtml } from "../../../utils/email.js";
import { nanoid } from "nanoid";
import { generateToken } from "../../../utils/generateAndVerifyToken.js";
import cartModel from "../../../../DB/models/cart.model.js";
export const signUp = asyncHandler(async (req, res, next) => {
    const isEmailExist = await userModel.findOne({ email: req.body.email })
    if (isEmailExist) {
        return next(new ErrorClass(`This email:"${req.body.email}" Already Exist!`, StatusCodes.CONFLICT))
    }
    req.body.phone = CryptoJS.AES.encrypt(req.body.phone, process.env.encrypt_key).toString()
    if (req.body.password != req.body.cPassword) {
        return next(new ErrorClass(`Please check your cPassword`, StatusCodes.CONFLICT))
    }
    req.body.password = hash(req.body.password)
    const code = nanoid(6)
    req.body.confirmCode = code
    const html = emailHtml(code)
    sendEmail({ to: req.body.email, subject: "Confirm Email", html })
    const user = await userModel.create(req.body)
    await cartModel.create({ userId: user._id })
    return res.status(StatusCodes.CREATED).json({ message: "Done", user })
})

export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { email, code } = req.body
    const isEmailExist = await userModel.findOne({ email })
    if (!isEmailExist) {
        return next(new ErrorClass(`This email:"${email}" Not Found!`, StatusCodes.NOT_FOUND))
    }
    if (isEmailExist.confirmEmail) {
        return next(new ErrorClass(`Email Already Confirmed!`, StatusCodes.NOT_ACCEPTABLE))
    }
    if (code != isEmailExist.confirmCode) {
        return next(new ErrorClass(`In-Valide code`, StatusCodes.BAD_REQUEST))
    }
    const newCode = nanoid(6)
    await userModel.updateOne({ email }, { confirmEmail: true, confirmCode: newCode })
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done" })
})

export const logIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const isExist = await userModel.findOne({ email })
    if (!isExist) {
        return next(new ErrorClass(`In-valide user Information`, StatusCodes.NOT_ACCEPTABLE))
    }
    const match = compare(password, isExist.password)
    if (!match) {
        return next(new ErrorClass(`In-valide user Information`, StatusCodes.NOT_ACCEPTABLE))
    }
    const payload = {
        id: isExist._id,
        email: isExist.email
    }
    const token = generateToken(payload)
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done", token })
})

export const sendCode = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const isEmailExist = await userModel.findOne({ email })
    if (!isEmailExist) {
        return next(new ErrorClass(`This user not Exist!`, StatusCodes.NOT_FOUND))
    }
    const code = nanoid(6)
    const html = emailHtml(code)
    sendEmail({ to: email, subject: "Confirm Email", html })
    await userModel.updateOne({ email }, {
        confirmCode: code
    })
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done", code })
})

export const restPassword = asyncHandler(async (req, res, next) => {
    let { email, code, password } = req.body;
    const isEmailExist = await userModel.findOne({ email })
    if (!isEmailExist) {
        return next(new ErrorClass(`This user not Exist!`, StatusCodes.NOT_FOUND))
    }
    if (code != isEmailExist.confirmCode) {
        return next(new ErrorClass(`In-Valide code`, StatusCodes.BAD_REQUEST))
    }
    password = hash(password)
    const newCode = nanoid(6)
    await userModel.updateOne({ email }, {
        password,
        confirmCode: newCode
    })
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done" })
})