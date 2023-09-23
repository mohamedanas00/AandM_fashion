import { Router } from "express";
import * as userController from './controller/user.js'
import * as validator from './user.validation.js'
import { validation } from "../../middleware/validation.js";
import auth, { roles } from "../../middleware/auth.js";
const userRouter = Router()

userRouter.route('/')
    .delete(auth([roles.user]),validation(validator.deleteAccount) ,userController.deleteAccount)
    .put(auth([roles.user]),validation(validator.updateProfile) ,userController.updateProfile)
    .get(auth([roles.user]),validation(validator.getUserData),userController.getUserData)

userRouter.route('/favourite')
    .get(auth([roles.user]),userController.getFavouriteProducts)


userRouter.route('/:id')
    .patch(auth([roles.user]),userController.addToFavourite)

export default userRouter