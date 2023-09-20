import { Router } from "express";
import * as categoryController from './controller/category.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as validator from './category.validation.js'
import { idValidation } from "../global/globalValidation.js";
import subcategoryRouter from "../subcategory/subcategory.routes.js";
import auth from "../../middleware/auth.js";
import { userAuth } from "./category.endpoint.js";

const categoryRouter = Router()


categoryRouter.use('/:categoryId/subcategory/', subcategoryRouter)

categoryRouter.route('/')
    .post(
        auth(userAuth.Roles),
        fileUpload(fileValidation.image).single('image'),
        validation(validator.addCategory),
        categoryController.addCategory
    )
    .get(
        validation(validator.getAllCategors),
        categoryController.getAllCategors
    )




categoryRouter.route('/:id')
    .delete(
        auth(userAuth.Roles),
        validation(idValidation),
        categoryController.deleteCategory
    )
    .put(
        auth(userAuth.Roles),
        fileUpload(fileValidation.image).single('image'),
        validation(validator.updateCategory),
        categoryController.updateCategory
    )



export default categoryRouter