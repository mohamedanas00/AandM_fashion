import { Router } from "express";
import * as userController from './controller/user.js'
const userRouter = Router()


userRouter.post('/signUp', userController.signUp)
userRouter.patch('/', userController.confirmEmail)
userRouter.post('/logIn', userController.logIn)
userRouter.patch('/sendCode', userController.sendCode)
userRouter.put('/restPassword', userController.restPassword)




export default userRouter