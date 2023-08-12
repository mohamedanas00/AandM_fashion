import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as brandController from './controller/brand.js'
import * as validator from './brand.validation.js'
import { idValidation } from "../global/globalValidation.js";
const brandRouter = Router()


brandRouter.route('/')
    .post(fileUpload(fileValidation.image).single('image'),
        validation(validator.addBrand),
        brandController.addBrand
    )
    .get(brandController.getAllBrands)

brandRouter.route('/:id')
    .delete(validation(idValidation),
        brandController.deleteBrand
    )
    .put(
        fileUpload(fileValidation.image).single('image'),
        validation(validator.updateBrand),
        brandController.updateBrand

    )


//fileUpload(fileValidation.image).single('image')   
export default brandRouter