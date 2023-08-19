import { Router } from "express";
import * as subcategoryController from './controller/subcategory.js'
import { validation } from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import *as validator from './subcategory.validation.js'
import { idValidation } from "../global/globalValidation.js";
import auth from "../../middleware/auth.js";
import { userAuth } from "./subcategory.endpoint.js";
const subcategoryRouter = Router({ mergeParams: true })



subcategoryRouter.route('/')
    .get(
        auth(userAuth.Roles),
        subcategoryController.getAllSubcategors
    )
    .post(
        auth(userAuth.Roles),
        fileUpload(fileValidation.image).single('image'),
        validation(validator.addSubcategory),
        subcategoryController.addSubcategory
    )

subcategoryRouter.route('/:id')
    .delete(
        auth(userAuth.Roles),
        validation(idValidation),
        subcategoryController.deleteSubCategory
    )
    .put(
        auth(userAuth.Roles),

        fileUpload(fileValidation.image).single('image'),
        validation(validator.updateSubcategory),
        subcategoryController.updateSubcategory
    )

export default subcategoryRouter