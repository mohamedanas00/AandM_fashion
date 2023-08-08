import categoryModel from "../../../../DB/models/category.model.js";
import { asyncHndeler } from "../../../utils/errorHandlinf.js";
import slugify from 'slugify'

export const addCategory = asyncHndeler(async (req, res, next) => {
    //name slug image
    const { name, slug } = req.body
    slugify(slug)
    const category = await categoryModel.create({ name, slug: slugify(slug) })
    res.status(201).json({ message: "catgory Added Successfully✅", category })
})