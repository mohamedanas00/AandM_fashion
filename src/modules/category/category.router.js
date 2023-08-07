import { Router } from "express";
const categoryRouter = Router()




categoryRouter.get('/', (req, res) => {
    res.status(200).json({ message: "category Module" })
})




export default categoryRouter