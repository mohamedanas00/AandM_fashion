import { StatusCodes } from "http-status-codes"
import { ErrorClass } from "../errorClass.js"
import { asyncHandler } from "../errorHandling.js"
import cloudinary from "../cloudinary.js"

export const deleteModel = (model) => {
    return asyncHandler(async (req, res, next) => {
        const { id } = req.params
        const isExist = await model.findByIdAndDelete(id)

        if (!isExist) {
            return next(new ErrorClass('This Category Not Exist!', StatusCodes.NOT_FOUND))
        }
        await cloudinary.uploader.destroy(isExist.image.public_id)
        return res.status(200).json({ message: "Done" })
    })
}
