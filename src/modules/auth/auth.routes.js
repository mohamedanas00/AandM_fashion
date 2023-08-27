import { Router } from "express";
import * as authController from './controller/auyh.js'
import { validation } from "../../middleware/validation.js";
import * as validator from './auth.validation.js'
const authRouter = Router()


authRouter.post('/signUp', validation(validator.signUp), authController.signUp)
authRouter.patch('/', validation(validator.confirmEmail), authController.confirmEmail)
authRouter.post('/logIn', validation(validator.logIn), authController.logIn)
authRouter.patch('/sendCode', validation(validator.sendCode), authController.sendCode)
authRouter.put('/restPassword', authController.restPassword)




export default authRouter