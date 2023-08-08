import { Router } from "express";
const userRouter = Router()




userRouter.get('/', (req, res) => {
    res.status(200).json({ message: "User Module" })
})




export default userRouter