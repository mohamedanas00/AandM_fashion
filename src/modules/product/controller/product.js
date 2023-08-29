import { StatusCodes } from "http-status-codes";
import productModel from "../../../../DB/models/product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import categoryModel from "../../../../DB/models/category.model.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import subcategoryModel from "../../../../DB/models/subcategory.model.js";
import slugify from "slugify";
import cloudinary from "../../../utils/cloudinary.js";
import brandModel from "../../../../DB/models/brand.model.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { deleteGlModel } from "../../global/handlers/delete.js";
import QRCode from "qrcode";

export const addProduct = asyncHandler(async (req, res, next) => {
    req.body.createdBy = req.user._id
    const isNameExist = await productModel.findOne({ name: req.body.name })
    if (isNameExist) {
        isNameExist.stock += Number(req.body.quantity)
        await isNameExist.save()

        return res.status(StatusCodes.ACCEPTED).json({ message: "Done", product: isNameExist })
    }
    console.log(req.body.categoryId);
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

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, { folder: `E-commerce/product/${req.body.slug}/image` })
    req.body.image = { secure_url, public_id }
    if (req.files.coverImages.length) {
        const coverImages = []
        for (let i = 0; i < req.files.coverImages.length; i++) {
            let { secure_url, public_id } = await cloudinary.uploader.upload(req.files.coverImages[i].path, { folder: `E-commerce/product/${req.body.slug}/coverImages` })
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
    req.body.QRcode = await QRCode.toDataURL(JSON.stringify({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        discount: req.body.discount,
        payementPrice: req.body.payementPrice,
        image: req.body.image.secure_url

    }))
    const product = await productModel.create(req.body)
    res.status(StatusCodes.CREATED).json({ message: "Done", product })
})

export const getAllProducts = asyncHandler(async (req, res, next) => {
    let apiFeatures = new ApiFeatures(productModel.find(), req.query).fields().pagination(productModel).search().sort().filter()
    let products = await apiFeatures.mongooseQuery
    res.status(StatusCodes.OK).json({
        Current_Page: apiFeatures.page,
        Next_Page: apiFeatures.next,
        Previous_Page: apiFeatures.previous,
        Total_Pages: apiFeatures.totalPages,
        Products_Count: apiFeatures.countDocuments,
        products
    })
})

export const deleteProducts = deleteGlModel(productModel, "product")

//////🚩🚩🚩🚩🚩-----🚩🚩🚩🚩🚩🚩🚩
export const updateProducts = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    if (req.body.name) {
        const isNameExist = await productModel.findOne({
            name: req.body.name,
            _id: { $ne: id }
        })
        if (isNameExist) {
            return next(new ErrorClass('This Product name already Exist!', StatusCodes.NOT_FOUND))
        }
        req.body.slug = slugify(req.body.name.toLowerCase())
    }
    if (req.files) {
        let slug;
        if (req.body.slug) {
            slug = req.body.slug
        } else {
            slug = isExist.slug
        }

    }
})
