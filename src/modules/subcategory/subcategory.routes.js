import { Router } from "express";
import * as subcategoryController from './controller/subcategory.js'
import { validation } from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import *as validator from './subcategory.validation.js'
const subcategoryRouter = Router()

subcategoryRouter.post('/', fileUpload(fileValidation.image).single('image'),
    validation(validator.addSubcategory), subcategoryController.addSubcategory)

subcategoryRouter.get('/', subcategoryController.getAllSubcategors)

subcategoryRouter.delete('/:id',
    validation(validator.deleteSubCategory),
    subcategoryController.deleteSubCategory
)


subcategoryRouter.put('/:id', fileUpload(fileValidation.image).single('image'),
    validation(validator.updateSubcategory),
    subcategoryController.updateSubcategory
)

export default subcategoryRouter