import { Router } from "express";
import * as categoryController from './controller/category.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
const categoryRouter = Router()


categoryRouter.post('/addCatgory',
    fileUpload(fileValidation.image).single('image'),
    categoryController.addCategory
)

categoryRouter.get('/getAllCategorys', categoryController.getAllCategors)
categoryRouter.delete('/deleteCategory/:id', categoryController.deleteCategory)


export default categoryRouter