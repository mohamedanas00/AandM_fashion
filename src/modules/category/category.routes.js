import { Router } from "express";
import * as categoryController from './controller/category.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as validator from './category.validation.js'
const categoryRouter = Router()


categoryRouter.post('/',
    fileUpload(fileValidation.image).single('image'),
    validation(validator.addCategory),
    categoryController.addCategory
)

categoryRouter.get('/', categoryController.getAllCategors)
categoryRouter.delete('/:id', validation(validator.deleteCategory), categoryController.deleteCategory)

categoryRouter.put('/:id',
    fileUpload(fileValidation.image).single('image'),
    validation(validator.updateCategory),
    categoryController.updateCategory
)


export default categoryRouter