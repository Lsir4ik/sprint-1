import {body, CustomValidator} from "express-validator";
import {inputValidationMiddleware} from "../input-validation-middleware";
import {blogsRepository} from "../../../repositories/blogs-db-repository";

const isValidBlogId: CustomValidator = async (value: string): Promise<boolean> => {
    const blog = await blogsRepository.findBlogById(value);
    if(!blog) {
        throw new Error('Invalid blogId')
    }
    return true
};
const titleValidation = body('title').isString().trim().notEmpty().isLength({max: 30})
const shortDescriptionValidation = body('shortDescription').isString().trim().notEmpty().isLength({max: 100})
const contentValidation = body('content').isString().trim().notEmpty().isLength({max: 1000})
const blogIdValidation = body('blogId').isString().trim().notEmpty().custom(isValidBlogId)

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

export const createPostForBlogValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware
]