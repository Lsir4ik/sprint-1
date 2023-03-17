import {Request, Response, Router} from "express";
import {CodeResponsesEnum, RequestWithBody, RequestWithParams, RequestWithParamsAndBody,} from "../types/types";
import {blogsLocalRepository} from "../repositories/blogs-repository";
import {BlogInputModel} from "../models/BlogsModels/BlogInputModel";
import {createBlogValidation, updateBlogValidation} from "../middlewares/validation/blogs/blogs-validation.middleware";
import {authMiddleware} from "../middlewares/authorization-middleware";


export const blogsRouter = Router();

blogsRouter.get('/', (req: Request, res: Response) => {
    const blogs = blogsLocalRepository.findAllBlogs()
    res.status(CodeResponsesEnum.OK_200).send(blogs);
});
blogsRouter.post('/', authMiddleware, createBlogValidation, (req:RequestWithBody<BlogInputModel>, res: Response) => {
    const newBlog = blogsLocalRepository.createBlog(req.body);
    res.status(CodeResponsesEnum.Created_201).send(newBlog);
});
blogsRouter.get('/:id', (req: RequestWithParams<{ id: string }>, res: Response) => {
    const foundBlog = blogsLocalRepository.findBlogById(+req.params.id);
    if(foundBlog) return res.status(CodeResponsesEnum.OK_200).send(foundBlog);
    return res.sendStatus(CodeResponsesEnum.Not_Found_404);
});
blogsRouter.put('/:id',authMiddleware, updateBlogValidation, (req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>, res: Response) => {
    let isUpdated = blogsLocalRepository.updateBlog(+req.params.id, req.body);
    if (!isUpdated) return res.sendStatus(CodeResponsesEnum.Not_Found_404);
    return res.sendStatus(CodeResponsesEnum.No_Content_204);
});
blogsRouter.delete('/:id', authMiddleware, (req:RequestWithParams<{ id: string }>, res: Response) => {
    let isDeleted = blogsLocalRepository.deleteBlogById(+req.params.id);
    if (isDeleted) return res.sendStatus(CodeResponsesEnum.No_Content_204);
    return res.sendStatus(CodeResponsesEnum.Not_Found_404);
});


