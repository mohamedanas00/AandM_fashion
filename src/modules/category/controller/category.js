import categoryModel from "../../../../DB/models/category.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from 'slugify'
import { asyncHandler } from "../../../utils/errorHandling.js";

export const addCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    const isExist = await categoryModel.findOne({ name: name })
    if (isExist) {
        return next(new Error('This name Category Exist!'))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'category📁' })
    const category = await categoryModel.create({ name, slug: slugify(name), image: { secure_url, public_id } })
    return res.status(201).json({ message: "catgory Added Successfully✅", category })
})

export const getAllCategors = asyncHandler(async (req, res, next) => {
    const categorys = await categoryModel.find()

    return res.status(200).json({ message: "Done", categorys })
})

export const deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const isExist = await categoryModel.findByIdAndDelete(id)
    console.log("dssdsds");
    console.log(isExist);
    if (!isExist) {
        return next(new Error('This Category Not Exist!'))
    }
    await cloudinary.uploader.destroy(isExist.image.public_id)
    return res.status(200).json({ message: "Deleted Successfuly" })
})