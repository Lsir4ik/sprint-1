import {Response, Router} from "express";
import {
    CodeResponsesEnum,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery,
} from "../types/types";
import {blogQueryRepository, blogsRepository} from "../repositories/Mongo/blogs-db-repository";
import {BlogInputModel} from "../models/BlogsModels/BlogInputModel";
import {createBlogValidation, updateBlogValidation} from "../middlewares/validation/blogs/blogs-validation.middleware";
import {authMiddleware} from "../middlewares/authorization-middleware";
import {QueryBlogInputModel} from "../models/BlogsModels/QueryBlogInputModel";
import {QueryBlogPostInputModel} from "../models/PostsModels/QueryBlogPostInputModel";
import {createPostForBlogValidation} from "../middlewares/validation/posts/posts-validation.middleware";
import {BlogPostInputModel} from "../models/BlogsModels/BlogPostInputModel";


export const blogsRouter = Router();

blogsRouter.get('/', async (req: RequestWithQuery<QueryBlogInputModel>, res: Response) => {
    const foundBlogs = await blogQueryRepository.pagingFindBlogs(
        req.query.searchNameTerm,
        req.query.sortBy,
        req.query.sortDirection,
        req.query.pageNumber,
        req.query.pageSize
    )
    res.status(CodeResponsesEnum.OK_200).send(foundBlogs);
});
blogsRouter.post('/', authMiddleware, createBlogValidation, async (req: RequestWithBody<BlogInputModel>, res: Response) => {
    const newBlog = await blogsRepository.createBlog(req.body);
    res.status(CodeResponsesEnum.Created_201).send(newBlog);
});
blogsRouter.get('/:id/posts', async (req: RequestWithParamsAndQuery<{ id: string }, QueryBlogPostInputModel>, res: Response) => {
    const postsOfBlog = await blogQueryRepository.getAllPostsOfBlog(
        req.params.id,
        req.query.pageNumber,
        req.query.pageSize,
        req.query.sortBy,
        req.query.sortDirection
    )
    if (postsOfBlog) return res.status(CodeResponsesEnum.OK_200).send(postsOfBlog);
    return res.sendStatus(CodeResponsesEnum.Not_Found_404);
});
blogsRouter.post('/:id/posts', authMiddleware, createPostForBlogValidation, async (req: RequestWithParamsAndBody<{ id: string }, BlogPostInputModel>, res: Response) => {
    const newPost = await blogsRepository.createPostForBlog(req.params.id, req.body);
    if (newPost) return res.status(CodeResponsesEnum.Created_201).send(newPost);
    return res.sendStatus(CodeResponsesEnum.Not_Found_404);
});
blogsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const foundBlog = await blogsRepository.findBlogById(req.params.id);
    if (foundBlog) return res.status(CodeResponsesEnum.OK_200).send(foundBlog);
    return res.sendStatus(CodeResponsesEnum.Not_Found_404);
});
blogsRouter.put('/:id', authMiddleware, updateBlogValidation, async (req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>, res: Response) => {
    let isUpdated = await blogsRepository.updateBlog(req.params.id, req.body);
    if (!isUpdated) return res.sendStatus(CodeResponsesEnum.Not_Found_404);
    return res.sendStatus(CodeResponsesEnum.No_Content_204);
});
blogsRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    let isDeleted = await blogsRepository.deleteBlogById(req.params.id);
    if (isDeleted) return res.sendStatus(CodeResponsesEnum.No_Content_204);
    return res.sendStatus(CodeResponsesEnum.Not_Found_404);
});


