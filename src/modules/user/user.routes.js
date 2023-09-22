import { Router } from "express";
import * as userController from './controller/user.js'
import * as validator from './user.validation.js'
import { validation } from "../../middleware/validation.js";
const userRouter = Router()

userRouter.delete('/', auth([roles.user]),validation(validator.deleteAccount) ,userController.deleteAccount)
userRouter.put('/', auth([roles.user]),validation(validator.updateProfile) ,userController.updateProfile)
userRouter.get('/',auth([roles.user]),validation(validator.getUserData),userController.getUserData)


export default userRouter