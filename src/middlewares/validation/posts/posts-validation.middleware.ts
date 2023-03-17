import {body} from "express-validator";
import {inputValidationMiddleware} from "../input-validation-middleware";
import {blogsLocalRepository} from "../../../repositories/blogs-repository";

const allBlogs = blogsLocalRepository.findAllBlogs()

const titleValidation = body('title').isString().trim().notEmpty().isLength({max: 30})
const shortDescriptionValidation = body('shortDescription').isString().trim().notEmpty().isLength({max: 100})
const contentValidation = body('content').isString().trim().notEmpty().isLength({max: 1000})
const blogIdValidation = body('blogId').isString().trim().notEmpty().custom(value => {
    for (const key of allBlogs) {
        if (+value === +key.id) {
            return true;
        }
    }
    throw new Error("There isn't such blogId")
});

export const createPostValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware
]

export const updatePostValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware
]