import { StatusCodes } from "http-status-codes";
import brandModel from "../../../../DB/models/brand.model.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import slugify from "slugify";
import cloudinary from "../../../utils/cloudinary.js";
import { deleteGlModel } from "../../global/handlers/delete.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";


export const addBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    const isExist = await brandModel.findOne({ name })

    if (isExist) {
        return next(new ErrorClass("This brand Already Exist", StatusCodes.CONFLICT))
    }
    const slug = slugify(name)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Brand/${slug}` })
    const brand = await brandModel.create({ name, slug, image: { secure_url, public_id } })
    return res.status(StatusCodes.CREATED).json({ message: "Done", brand })
})


export const getAllBrands = asyncHandler(async (req, res, next) => {
    let apiFeatures = new ApiFeatures(brandModel.find(), req.query).fields().pagination().search().sort().filter()
    let brands = await apiFeatures.mongooseQuery
    res.status(StatusCodes.OK).json({ page: apiFeatures.page, brands })
})


export const deleteBrand = deleteGlModel(brandModel, "brand")


export const updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const isExist = await brandModel.findById(id)
    if (!isExist) {
        return next(new ErrorClass("This brand not Exist!", StatusCodes.NOT_FOUND))
    }
    if (req.body.name) {
        const isNameExist = await brandModel.findOne({
            name: req.body.name,
            _id: { $ne: id }

        })
        if (isNameExist) {
            return next(new ErrorClass("This Name Already Exist!", StatusCodes.CONFLICT))
        }
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
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Brand/${slug}` })
        req.body.image = { secure_url, public_id }
    }
    await brandModel.updateOne({ _id: id }, req.body)
    return res.status(200).json({ message: "Done" })
})