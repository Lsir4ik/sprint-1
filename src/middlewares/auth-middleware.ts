import {body} from "express-validator";
import {inputValidationMiddleware} from "./validation/input-validation-middleware";

const loginValidation = body('login').isString().isLength({min: 3, max: 10}).matches(/^[a-zA-Z0-9_-]*$/)
const passwordValidation = body('password').isString().isLength({min: 6, max: 20})
const emailValidation = body('email').isString().isEmail()
export const authorisationMiddleware = [
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware
]
