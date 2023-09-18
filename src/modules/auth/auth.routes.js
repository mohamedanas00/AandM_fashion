import { Router } from "express";
import * as authController from './controller/auth.js'
import { validation } from "../../middleware/validation.js";
import * as validator from './auth.validation.js'
import auth, { roles } from "../../middleware/auth.js";
const authRouter = Router()


authRouter.post('/signUp', validation(validator.signUp), authController.signUp)
authRouter.patch('/', validation(validator.confirmEmail), authController.confirmEmail)
authRouter.post('/logIn', validation(validator.logIn), authController.logIn)
authRouter.patch('/sendCode', validation(validator.sendCode), authController.sendCode)
authRouter.put('/restPassword', authController.restPassword)
authRouter.delete('/', auth([roles.user]),validation(validator.deleteAccount) ,authController.delteAccount)
authRouter.put('/updateProfile', auth([roles.user]),validation(validator.updateProfile) ,authController.updateProfile)
authRouter.get('/',auth([roles.user]),validation(validator.getUserData),authController.getUserData)


export default authRouter