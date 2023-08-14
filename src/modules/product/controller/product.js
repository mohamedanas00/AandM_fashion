import { StatusCodes } from "http-status-codes";
import productModel from "../../../../DB/models/product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import categoryModel from "../../../../DB/models/category.model.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import subcategoryModel from "../../../../DB/models/subcategory.model.js";
import slugify from "slugify";
import cloudinary from "../../../utils/cloudinary.js";
import brandModel from "../../../../DB/models/brand.model.js";


export const addProduct = asyncHandler(async (req, res, next) => {

    const isNameExist = await productModel.findOne({ name: req.body.name })
    if (isNameExist) {
        isNameExist.stock += Number(req.body.quantity)
        await isNameExist.save()

        return res.status(StatusCodes.ACCEPTED).json({ message: "Done", product: isNameExist })
    }
    const isCategoryExist = await categoryModel.findById(req.body.categoryId)
    const isSubcategoryExist = await subcategoryModel.findById(req.body.subcategoryId)
    const isBrandExist = await brandModel.findById(req.body.brandId)

    if (!isCategoryExist) {
        return next(new ErrorClass("category not Exist!", StatusCodes.NOT_FOUND))
    }
    if (!isSubcategoryExist) {
        return next(new ErrorClass("subcategory not Exist!", StatusCodes.NOT_FOUND))
    }
    if (!isBrandExist) {
        return next(new ErrorClass("brand not Exist!", StatusCodes.NOT_FOUND))
    }
    req.body.slug = slugify(req.body.name.toLowerCase())
    req.body.stock = Number(req.body.quantity)

    req.body.payementPrice = req.body.price - (req.body.price * ((req.body.discount || 0) / 100))

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, { folder: `product/${req.body.slug}/image` })
    req.body.image = { secure_url, public_id }
    if (req.files.coverImages.length) {
        const coverImages = []
        for (let i = 0; i < req.files.coverImages.length; i++) {
            let { secure_url, public_id } = await cloudinary.uploader.upload(req.files.coverImages[i].path, { folder: `product/${req.body.slug}/coverImages` })
            coverImages.push({ secure_url, public_id })
        }
        req.body.coverImages = coverImages
    }
    if (req.body.sizes) {
        req.body.sizes = JSON.parse(req.body.sizes)
    }
    if (req.body.colors) {
        req.body.colors = JSON.parse(req.body.colors)
    }
    const product = await productModel.create(req.body)
    res.status(StatusCodes.CREATED).json({ message: "Done", product })
})