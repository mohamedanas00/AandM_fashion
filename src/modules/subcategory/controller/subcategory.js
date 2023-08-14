import slugify from "slugify";
import categoryModel from "../../../../DB/models/category.model.js";
import subcategoryModel from "../../../../DB/models/subcategory.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { StatusCodes } from "http-status-codes";
import { ErrorClass } from "../../../utils/errorClass.js";
import { deleteGlModel } from "../../global/handlers/delete.js";

export const addSubcategory = asyncHandler(async (req, res, next) => {
    const { name, categoryId } = req.body
    const isCategoryExist = await categoryModel.findById(categoryId)
    if (!isCategoryExist) {
        return next(new ErrorClass("CategoryId is not Exist", StatusCodes.NOT_FOUND))
    }
    const isNameExist = await subcategoryModel.findOne({ name })
    if (isNameExist) {
        return next(new ErrorClass("Subcategory already Exist", StatusCodes.CONFLICT))
    }
    const slug = slugify(name)
    //secure_url public_id
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `subcategory/${name}` })
    await subcategoryModel.create({ name, categoryId, slug, image: { secure_url, public_id } })
    return res.status(201).json({ message: "Done" })
})

//get all subcategory for spacific category
export const getAllSubcategors = asyncHandler(async (req, res, next) => {
    
    const subcategorys = await subcategoryModel.find(req.params).populate([{
        path: 'categoryId'
    }])
    return res.status(200).json({ message: "Done", subcategorys })
})

export const deleteSubCategory = deleteGlModel(subcategoryModel, "subcategory")

export const updateSubcategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const category = await categoryModel.findById(req.body.categoryId)
    if (!category) {
        return next(new ErrorClass('This Category Not Exist!', StatusCodes.NOT_FOUND))
    }
    if (req.body.name) {
        //this name is exist in other category?
        const isNameExist = await subcategoryModel.findOne({
            name: req.body.name,
            _id: { $ne: id }
        })
        if (isNameExist) {
            return next(new ErrorClass('This Subcategory name already Exist!', StatusCodes.CONFLICT))
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
        await cloudinary.uploader.destroy(category.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `subcategory/${slug}` })
        //add image to body
        req.body.image = { secure_url, public_id }
    }
    await categoryModel.updateOne({ _id: id }, req.body)
    return res.status(200).json({ message: "Done" })
})