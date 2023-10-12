import { StatusCodes } from "http-status-codes";
import { ErrorClass } from "./errorClass.js";
import { generateToken } from "./generateAndVerifyToken.js";
import { compare } from "./hashing.js";
import { asyncHandler } from "./errorHandling.js";
import userModel from "../../DB/models/user.model.js";

export const logIn = (Role) => {
  return asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const isExist = await userModel.findOne({ email });
    if (!isExist) {
      return next(
        new ErrorClass(`In-valid user Information`, StatusCodes.NOT_ACCEPTABLE)
      );
    }
    if (isExist.role != Role) {
      return next(new ErrorClass(`NON_AUTHORITATIVE`, StatusCodes.FORBIDDEN));
    }
    if (isExist.confirmEmail == false) {
      return next(
        new ErrorClass(
          `NON_AUTHORITATIVE`,
          StatusCodes.NON_AUTHORITATIVE_INFORMATION
        )
      );
    }
    if (isExist.provider == "google") {
      return next(
        new ErrorClass("please use google login"),
        StatusCodes.CONFLICT
      );
    }
    const match = compare(password, isExist.password);
    if (!match) {
      return next(
        new ErrorClass(`In-valid user Information`, StatusCodes.NOT_ACCEPTABLE)
      );
    }
    const payload = {
      id: isExist._id,
      email: isExist.email,
    };
    const token = generateToken(payload);
    return res.status(StatusCodes.ACCEPTED).json({ message: "Done", token });
  });
};
