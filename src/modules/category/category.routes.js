import { Router } from "express";
import * as categoryController from './controller/category.js'
const categoryRouter = Router()


categoryRouter.post('/addCatgory', categoryController.addCategory)

categoryRouter.get('/', (req, res) => {
    res.status(200).json({ message: "category Module" })
})




export default categoryRouter