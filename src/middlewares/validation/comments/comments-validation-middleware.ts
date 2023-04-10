import {body} from "express-validator";
import {inputValidationMiddleware} from "../input-validation-middleware";

const contentValidation = body('content').isString().isLength({min:20, max:300})

export const createCommentValidation = [
    contentValidation,
    inputValidationMiddleware
]