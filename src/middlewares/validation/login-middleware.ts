import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";

const loginValidation = body('login').isString().isLength({min: 3, max: 10}).matches(/^[a-zA-Z0-9_-]*$/)
const passwordValidation = body('password').isString().isLength({min: 6, max: 20})
const emailValidation = body('email').isString().isEmail()
const loginOrEmailValidation = body('loginOrEmail').isString()
export const createUserValidation = [
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware
]
export const loginInputValidation = [
    loginOrEmailValidation,
    passwordValidation,
    inputValidationMiddleware
]