import { Router } from "express";
import * as userController from './controller/user.js'
import { validation } from "../../middleware/validation.js";
import * as validator from './user.validation.js'
const userRouter = Router()


userRouter.post('/signUp', validation(validator.signUp), userController.signUp)
userRouter.patch('/', validation(validator.confirmEmail), userController.confirmEmail)
userRouter.post('/logIn', validation(validator.logIn), userController.logIn)
userRouter.patch('/sendCode', validation(validator.sendCode), userController.sendCode)
userRouter.put('/restPassword', userController.restPassword)




export default userRouter