import { Router } from "express";
import * as subcategoryController from './controller/subcategory.js'
import { validation } from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import *as validator from './subcategory.validation.js'
import { idValidation } from "../global/globalValidation.js";
const subcategoryRouter = Router({ mergeParams: true })



subcategoryRouter.route('/')
    .get(subcategoryController.getAllSubcategors)
    .post(
        fileUpload(fileValidation.image).single('image'),
        validation(validator.addSubcategory),
        subcategoryController.addSubcategory
    )

subcategoryRouter.route('/:id')
    .delete(
        validation(idValidation),
        subcategoryController.deleteSubCategory
    )
    .put(fileUpload(fileValidation.image).single('image'),
        validation(validator.updateSubcategory),
        subcategoryController.updateSubcategory
    )

export default subcategoryRouter