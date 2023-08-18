import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as productController from './controller/product.js'
import { idValidation } from "../global/globalValidation.js";
import { validation } from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";
import { userAuth } from "./product.endpoint.js";
const productRouter = Router()

productRouter.route('/')
    .post(
        auth(userAuth.Roles),
        fileUpload(fileValidation.image).fields([
            { name: 'image', maxCount: 1 },
            { name: 'coverImages', maxCount: 5 }
        ]), productController.addProduct)
    .get(
        auth(userAuth.Roles),
        productController.getAllProducts
    )


productRouter.route('/:id')
    .delete(
        auth(userAuth.Roles),
        validation(idValidation), productController.deleteProducts)
export default productRouter