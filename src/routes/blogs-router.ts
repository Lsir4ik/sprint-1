import {Request, Response, Router} from "express";
import {CodeResponsesEnum, RequestWithBody, RequestWithParams, RequestWithParamsAndBody,} from "../types/types";
import {blogsRepository} from "../repositories/Mongo/blogs-db-repository";
import {BlogInputModel} from "../models/BlogsModels/BlogInputModel";
import {createBlogValidation, updateBlogValidation} from "../middlewares/validation/blogs/blogs-validation.middleware";
import {authMiddleware} from "../middlewares/authorization-middleware";


export const blogsRouter = Router();

blogsRouter.get('/', async (req: Request, res: Response) => {
    const blogs = await blogsRepository.findAllBlogs()
    res.status(CodeResponsesEnum.OK_200).send(blogs);
});
blogsRouter.post('/', authMiddleware, createBlogValidation, async (req: RequestWithBody<BlogInputModel>, res: Response) => {
    const newBlog = await blogsRepository.createBlog(req.body);
    res.status(CodeResponsesEnum.Created_201).send(newBlog);
});
blogsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    try{
        const foundBlog = await blogsRepository.findBlogById(req.params.id);
        return res.status(CodeResponsesEnum.OK_200).send(foundBlog);
    }catch (e) {
        console.log(e)
        return res.sendStatus(CodeResponsesEnum.Not_Found_404);
    }

});
blogsRouter.put('/:id',authMiddleware, updateBlogValidation, async (req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>, res: Response) => {
    let isUpdated = await blogsRepository.updateBlog(req.params.id, req.body);
    if (!isUpdated) return res.sendStatus(CodeResponsesEnum.Not_Found_404);
    return res.sendStatus(CodeResponsesEnum.No_Content_204);
});
blogsRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    let isDeleted = await blogsRepository.deleteBlogById(req.params.id);
    if (isDeleted) return res.sendStatus(CodeResponsesEnum.No_Content_204);
    return res.sendStatus(CodeResponsesEnum.Not_Found_404);
});


