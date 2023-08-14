import { Router } from "express";
import * as categoryController from './controller/category.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as validator from './category.validation.js'
import { idValidation } from "../global/globalValidation.js";
import subcategoryRouter from "../subcategory/subcategory.routes.js";

const categoryRouter = Router()


categoryRouter.use('/:categoryId/subcategory/', subcategoryRouter)
categoryRouter.route('/')
    .post(
        fileUpload(fileValidation.image).single('image'),
        validation(validator.addCategory),
        categoryController.addCategory
    )
    .get(categoryController.getAllCategors)




categoryRouter.route('/:id')
    .delete(validation(idValidation), categoryController.deleteCategory)
    .put(
        fileUpload(fileValidation.image).single('image'),
        validation(validator.updateCategory),
        categoryController.updateCategory
    )



export default categoryRouter