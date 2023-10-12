import { Router } from "express";
import * as userController from "./controller/user.js";
import * as validator from "./user.validation.js";
import { validation } from "../../middleware/validation.js";
import auth, { roles } from "../../middleware/auth.js";
import { userAuth } from "./user.endpoint.js";

const userRouter = Router();

userRouter
  .route("/")
  .delete(
    auth(userAuth.userRole),
    validation(validator.basic),
    userController.deleteAccount
  )
  .put(
    auth(userAuth.userRole),
    validation(validator.updateProfile),
    userController.updateProfile
  )
  .get(
    auth(userAuth.userRole),
    validation(validator.basic),
    userController.getUserData
  );

userRouter
  .route("/Favorite")
  .get(
    auth(userAuth.userRole),
    validation(validator.basic),
    userController.getFavoriteProducts
  );

userRouter
  .route("/:id")
  .patch(
    auth(userAuth.userRole),
    validation(validator.addToFavorite),
    userController.addToFavorite
  );

userRouter.get(
  "/RegularUsers",
  auth(userAuth.adminRole),
  validation(validator.basic),
  userController.getAllRegularUsers
);
export default userRouter;
