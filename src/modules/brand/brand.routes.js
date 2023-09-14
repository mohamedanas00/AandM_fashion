import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as brandController from './controller/brand.js'
import * as validator from './brand.validation.js'
import { idValidation } from "../global/globalValidation.js";
import auth, { roles } from "../../middleware/auth.js";
import { userAuth } from "./brand.endPoint.js";
const brandRouter = Router()


brandRouter.route('/')
    .post(
        auth(userAuth.Roles),
        fileUpload(fileValidation.image).single('image'),
        validation(validator.addBrand),
        brandController.addBrand
    )
    .get(
        auth(userAuth.Roles),
        validation(validator.getAllBrands),
        brandController.getAllBrands)

brandRouter.route('/:id')
    .delete(
        auth(userAuth.Roles),
        validation(idValidation),
        brandController.deleteBrand
    )
    .put(
        auth(userAuth.Roles),
        fileUpload(fileValidation.image).single('image'),
        validation(validator.updateBrand),
        brandController.updateBrand
    )


//fileUpload(fileValidation.image).single('image')   
export default brandRouter