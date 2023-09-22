import { StatusCodes } from "http-status-codes"
import userModel from "../../../../DB/models/user.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import { ErrorClass } from "../../../utils/errorClass.js"
import CryptoJS from "crypto-js";




export const deleteAccount = asyncHandler(async (req, res, next) => {    
    const userId = req.user._id
    const user = new userModel({_id: userId})
    await user.deleteOne({ _id: userId })
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done" })
})

export const updateProfile = asyncHandler (async (req,res,next)=>{
    let {name , email ,phone ,birthday} = req.body
    const id = req.user._id
    if(email){
        const isEmailExist = await userModel.findOne({ email: req.body.email })
        if (isEmailExist) {
            return next(new ErrorClass(`This email:"${req.body.email}" Already Exist!`, StatusCodes.CONFLICT))
        }
    }
    if(phone){
        phone = CryptoJS.AES.encrypt(phone, process.env.encrypt_key).toString()
    }
    await userModel.updateOne({_id:id},{
        name , 
        email,
        phone,
        birthday
    })
    return res.status(StatusCodes.ACCEPTED).json({message:"Done"})

})

export const getUserData = asyncHandler(async(req,res,next)=>{
    if(req.user.phone){
        req.user.phone= CryptoJS.AES.decrypt(req.user.phone, process.env.encrypt_key).toString(CryptoJS.enc.Utf8);
    } 
    return res.status(StatusCodes.OK).json({
        name:req.user.name,
        email:req.user.email,
        phone:req.user.phone,
        birthday:req.user.birthday
    })
})