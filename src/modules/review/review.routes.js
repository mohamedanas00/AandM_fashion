import { Router } from "express";
import *  as reviewController from './controller/review.js'
import auth from "../../middleware/auth.js";
import { userAuth } from "./reviewendpoint.js";
const reviewRouter = Router()

reviewRouter.route('/')
    .post(auth(userAuth.Roles), reviewController.addReview)

reviewRouter.route('/:id')
    .put(auth(userAuth.Roles), reviewController.updateReview)
    .delete(auth(userAuth.Roles), reviewController.deleteReview)


export default reviewRouter
