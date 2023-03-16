import {body} from "express-validator";
import {inputValidationMiddleware} from "../input-validation-middleware";


const nameValidation = body('name').isString().trim().notEmpty().isLength({max: 15})

const descriptionValidation = body('description').isString().trim().notEmpty().isLength({max: 500})

const websiteUrlValidation = body('websiteUrl').isURL()

export const createBlogValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware
]

export const updateBlogValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware
]