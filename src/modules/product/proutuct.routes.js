import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as productController from './controller/product.js'
import { idValidation } from "../global/globalValidation.js";
import { validation } from "../../middleware/validation.js";
const productRouter = Router()

productRouter.route('/')
    .post(fileUpload(fileValidation.image).fields([
        { name: 'image', maxCount: 1 },
        { name: 'coverImages', maxCount: 5 }
    ]), productController.addProduct)
    .get(productController.getAllProducts)


productRouter.route('/:id')
    .delete(validation(idValidation), productController.deleteProducts)
export default productRouter