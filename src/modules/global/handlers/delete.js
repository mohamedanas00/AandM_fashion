import { StatusCodes } from "http-status-codes"
import { ErrorClass } from "../../../utils/errorClass.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import cloudinary from "../../../utils/cloudinary.js"
import subcategoryModel from "../../../../DB/models/subcategory.model.js"

export const deleteModel = (model, modelName) => {
    return asyncHandler(async (req, res, next) => {
        const { id } = req.params

        const isExist = await model.findByIdAndDelete(id)

        if (!isExist) {
            return next(new ErrorClass(`This ${modelName}  Not Exist!`, StatusCodes.NOT_FOUND))
        }
        await cloudinary.uploader.destroy(isExist.image.public_id)
        return res.status(200).json({ message: "Done" })
    })
}


// const relatedToCategory = async (id) => {
//     await subcategoryModel.deletMany({ categoryId: id })
// }