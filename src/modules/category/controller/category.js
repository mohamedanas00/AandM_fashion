import categoryModel from "../../../../DB/models/category.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from 'slugify'
import { asyncHandler } from "../../../utils/errorHandling.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { StatusCodes } from "http-status-codes";
import { deleteGlModel } from "../../global/handlers/delete.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";

export const addCategory = asyncHandler(async (req, res, next) => {
    let { name } = req.body
    const isExist = await categoryModel.findOne({ name: name })
    if (isExist) {
        return next(new ErrorClass("This Category Already Exist!", StatusCodes.CONFLICT))
    }
    const slug = slugify(name)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `E-commerce/category/${slug}` })
    const category = await categoryModel.create({ name, slug, image: { secure_url, public_id } })
    return res.status(201).json({ message: "Done", category })
})

export const getAllCategors = asyncHandler(async (req, res, next) => {

    let apiFeatures = new ApiFeatures(categoryModel.find(), req.query).fields().pagination().search().sort().filter()
    let categorys = await apiFeatures.mongooseQuery
        .populate([{
            path: 'Subcategorise'
        }])
    res.status(StatusCodes.OK).json({ page: apiFeatures.page, categorys })
})

export const deleteCategory = deleteGlModel(categoryModel, "category")


export const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const isExist = await categoryModel.findById(id)
    if (!isExist) {
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
        let slug;
        if (req.body.slug) {
            slug = req.body.slug
        } else {
            slug = isExist.slug
        }
        await cloudinary.uploader.destroy(isExist.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `E-commerce/category/${slug}` })
        //add image to body
        req.body.image = { secure_url, public_id }
    }
    await categoryModel.updateOne({ _id: id }, req.body)
    return res.status(200).json({ message: "Done" })
})