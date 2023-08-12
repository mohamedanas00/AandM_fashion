import categoryModel from "../../../../DB/models/category.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from 'slugify'
import { asyncHandler } from "../../../utils/errorHandling.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { StatusCodes } from "http-status-codes";
import { deleteModel } from "../../../utils/handlers/delete.js";

export const addCategory = asyncHandler(async (req, res, next) => {
    let { name } = req.body
    const isExist = await categoryModel.findOne({ name: name })
    if (isExist) {
        return next(new ErrorClass("This name Category Exist!", StatusCodes.CONFLICT))
    }
    const slug = slugify(name)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "category" })
    const category = await categoryModel.create({ name, slug, image: { secure_url, public_id } })
    return res.status(201).json({ message: "catgory Added Successfully✅", category })
})

export const getAllCategors = asyncHandler(async (req, res, next) => {
    const categorys = await categoryModel.find().populate([{
        path: 'Subcategorise'
    }])

    return res.status(200).json({ message: "Done", categorys })
})

export const deleteCategory = deleteModel(categoryModel)


export const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const category = await categoryModel.findById(id)
    if (!category) {
        return next(new ErrorClass('This Category Not Exist!', StatusCodes.NOT_FOUND))
    }
    if (req.body.name) {
        //this name is exist in other category?
        const isNameExist = await categoryModel.findOne({
            name: req.body.name,
            _id: { $ne: id }
        })
        if (isNameExist) {
            return next(new ErrorClass('This Category name already Exist!', StatusCodes.CONFLICT))
        }
        //add slug to body
        req.body.slug = slugify(req.body.name)
    }
    if (req.file) {
        await cloudinary.uploader.destroy(category.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'category' })
        //add image to body
        req.body.image = { secure_url, public_id }
    }
    console.log(req.body);
    await categoryModel.updateOne({ _id: id }, req.body)
    return res.status(200).json({ message: "Update Successfully" })
})