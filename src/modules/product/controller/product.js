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
import QRCode from "qrcode";

export const addProduct = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user._id;
  const isNameExist = await productModel.findOne({ name: req.body.name });
  if (isNameExist) {
    //*Add To Exist product
    await addToExistProduct({ isNameExist, req });
    return res
      .status(StatusCodes.ACCEPTED)
      .json({ message: "Done", product: isNameExist });
  }
  const isCategoryExist = await categoryModel.findById(req.body.categoryId);
  const isSubcategoryExist = await subcategoryModel.findById(
    req.body.subcategoryId
  );
  const isBrandExist = await brandModel.findById(req.body.brandId);
  if (!isCategoryExist) {
    return next(new ErrorClass("category not Exist!", StatusCodes.NOT_FOUND));
  }
  if (!isSubcategoryExist) {
    return next(
      new ErrorClass("subcategory not Exist!", StatusCodes.NOT_FOUND)
    );
  }
  if (!isBrandExist) {
    return next(new ErrorClass("brand not Exist!", StatusCodes.NOT_FOUND));
  }
  req.body.slug = slugify(req.body.name.toLowerCase());

  req.body.paymentPrice =
    req.body.price - req.body.price * ((req.body.discount || 0) / 100);

  let totalQuantity = 0;
  let detailsArray = JSON.parse(req.body.details);
  req.body.details = JSON.parse(req.body.details);
  for (const sizeObject of detailsArray) {
    totalQuantity += Number(sizeObject.quantity);
  }
  req.body.stock = totalQuantity;

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.image[0].path,
    { folder: `E-commerce/product/${req.body.slug}/image` }
  );
  req.body.image = { secure_url, public_id };
  if (req.files.coverImages.length) {
    const coverImages = [];
    for (let i = 0; i < req.files.coverImages.length; i++) {
      let { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.coverImages[i].path,
        { folder: `E-commerce/product/${req.body.slug}/coverImages` }
      );
      coverImages.push({ secure_url, public_id });
    }
    req.body.coverImages = coverImages;
  }

  req.body.QRcode = await QRCode.toDataURL(
    JSON.stringify({
      name: req.body.name,
      description: req.body.description,
      originalPrice: req.body.price,
      discount: req.body.discount,
      finalPrice: req.body.paymentPrice,
      image: req.body.image.secure_url,
    })
  );

  const product = await productModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ message: "Done", product });
});

export const getAllProducts = asyncHandler(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .fields()
    .pagination(productModel)
    .search()
    .sort()
    .filter();
  let products = await apiFeatures.mongooseQuery.populate({
    path: "createdBy",
    select: "email name",
  });
  res.status(StatusCodes.OK).json({
    Current_Page: apiFeatures.page,
    Next_Page: apiFeatures.next,
    Previous_Page: apiFeatures.previous,
    Total_Pages: apiFeatures.totalPages,
    Products_Count: apiFeatures.countDocuments,
    products,
  });
});

export const deleteProducts = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const isExist = await productModel.findByIdAndDelete(id);
  if (!isExist) {
    return next(
      new ErrorClass(`This product Not Exist!`, StatusCodes.NOT_FOUND)
    );
  }
  await cloudinary.uploader.destroy(isExist.image.public_id);
  for (const image of isExist.coverImages) {
    await cloudinary.uploader.destroy(image.public_id);
  }
  return res.status(200).json({ message: "Done" });
});

export const updateProducts = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const isExist = await productModel.findById(id);
  if (!isExist) {
    return next(new ErrorClass("Product not Exist!", StatusCodes.NOT_FOUND));
  }
  if (req.body.name) {
    const name = req.body.name;
    const isNameExist = await productModel.findOne({
      name,
      _id: { $ne: id },
    });
    if (isNameExist) {
      return next(
        new ErrorClass(
          "This Product name already Exist!",
          StatusCodes.NOT_FOUND
        )
      );
    }
    var slug = slugify(req.body.name.toLowerCase());
  }

  if (req.body.discount && req.body.price) {
    var paymentPrice = 0;
    paymentPrice = req.body.price - req.body.price * (req.body.discount / 100);
  } else if (req.body.price) {
    var paymentPrice = 0;
    paymentPrice = req.body.price - req.body.price * (isExist.discount / 100);
  } else if (req.body.discount) {
    var paymentPrice = 0;
    paymentPrice = isExist.price - isExist.price * (req.body.discount / 100);
  }
  if (req.file) {
    await cloudinary.uploader.destroy(isExist.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `E-commerce/product/${slug}/image` }
    );
    req.body.image = { secure_url, public_id };
  }

  await productModel.updateOne(
    { _id: id },
    {
      name: req.body.name,
      slug,
      price: req.body.price,
      discount: req.body.discount,
      paymentPrice,
      image: req.body.image,
    }
  );

  return res.status(StatusCodes.OK).json({ message: "Done" });
});

export const updateCoverImage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { publicId } = req.body;
  const isExist = await productModel.findById(id);
  if (!isExist) {
    return next(new ErrorClass("Product not Exist!", StatusCodes.NOT_FOUND));
  }
  await cloudinary.uploader.destroy(publicId);

  await productModel.updateOne(
    { _id: id },
    {
      $pull: { coverImages: { publicId: publicId } },
    }
  );

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `E-commerce/product/${isExist.slug}/coverImages` }
  );

  isExist.coverImages = isExist.coverImages.push({ secure_url, public_id });
  await isExist.save();
  return res.status(StatusCodes.OK).json({ message: "Done" });
});

export const getSubCategoryProducts = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let apiFeatures = new ApiFeatures(
    productModel.find({ subcategoryId: id }),
    req.query
  )
    .fields()
    .pagination(productModel)
    .search()
    .sort()
    .filter();
  let products = await apiFeatures.mongooseQuery.populate({
    path: "createdBy",
    select: "email name",
  });
  res.status(StatusCodes.OK).json({
    Current_Page: apiFeatures.page,
    Next_Page: apiFeatures.next,
    Previous_Page: apiFeatures.previous,
    Total_Pages: apiFeatures.totalPages,
    Products_Count: apiFeatures.countDocuments,
    products,
  });
});

const addToExistProduct = async ({ isNameExist, req } = {}) => {
  let totalQuantity = 0;
  const detailsArray = JSON.parse(req.body.details);
  for (const sizeObject of detailsArray) {
    let check = false;
    for (let i = 0; i < isNameExist.details.length; i++) {
      if (isNameExist.details[i].size == sizeObject.size) {
        isNameExist.details[i].quantity += sizeObject.quantity;
        totalQuantity += sizeObject.quantity;
        isNameExist.details[i].colors = Array.from(
          new Set([...isNameExist.details[i].colors, ...sizeObject.colors])
        );
        check = true;
        break;
      }
    }
    if (!check) {
      totalQuantity += sizeObject.quantity;
      isNameExist.details.push(sizeObject);
    }
  }
  isNameExist.stock += totalQuantity;
  await isNameExist.save();
};
