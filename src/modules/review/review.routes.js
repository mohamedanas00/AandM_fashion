import { Router } from "express";
import *  as reviewController from './controller/review.js'
import auth from "../../middleware/auth.js";
import { userAuth } from "./reviewendpoint.js";
import * as validator from './review.validation.js'
import { validation } from "../../middleware/validation.js";
const reviewRouter = Router()

reviewRouter.route('/')
    .post(auth(userAuth.Roles), validation(validator.addReview), reviewController.addReview)

reviewRouter.route('/:id')
    .put(auth(userAuth.Roles), validation(validator.updateReview), reviewController.updateReview)
    .delete(auth(userAuth.Roles), validation(validator.deleteReview), reviewController.deleteReview)


export default reviewRouter
