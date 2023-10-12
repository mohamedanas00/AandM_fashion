import { Router } from "express";
import * as authController from './controller/auth.js'
import { validation } from "../../middleware/validation.js";
import * as validator from './auth.validation.js'
import auth, { roles } from "../../middleware/auth.js";
const authRouter = Router()


authRouter.post('/signUp', validation(validator.signUp), authController.signUp)
authRouter.patch('/', validation(validator.confirmEmail), authController.confirmEmail)
authRouter.post('/adminLogIn', validation(validator.logIn), authController.adminLogIn)
authRouter.post('/userLogIn', validation(validator.logIn), authController.userLogIn)

authRouter.patch('/sendCode', validation(validator.sendCode), authController.sendCode)
authRouter.put('/restPassword', authController.restPassword)
// authRouter.post('/socialLogin',authController.socialLogin)


export default authRouter