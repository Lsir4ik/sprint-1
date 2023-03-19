import {Response, Router} from "express";
import {
    CodeResponsesEnum,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../types/types";
import {PostInputModel} from "../models/PostsModels/PostInputModel";
import {authMiddleware} from "../middlewares/authorization-middleware";
import {createPostValidation, updatePostValidation} from "../middlewares/validation/posts/posts-validation.middleware";
import {postsRepository} from "../repositories/Mongo/posts-db-repository";

export const postsRouter = Router();

postsRouter.get('/', async (req: RequestWithQuery<{ name: string }>, res: Response) => {
    const foundPosts = await postsRepository.findAllPosts()
    res.status(CodeResponsesEnum.OK_200).send(foundPosts);
});
postsRouter.post('/', authMiddleware, createPostValidation, async (req: RequestWithBody<PostInputModel>, res: Response) => {
    const newPost = await postsRepository.createPost(req.body);
    if (!newPost) return res.sendStatus(CodeResponsesEnum.Not_Found_404);
    return res.status(CodeResponsesEnum.Created_201).send(newPost);
});
postsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const newPost = await postsRepository.findPostById(req.params.id);
    if (newPost) return res.status(CodeResponsesEnum.OK_200).send(newPost);
    return res.sendStatus(CodeResponsesEnum.Not_Found_404);
});
postsRouter.put('/:id', authMiddleware, updatePostValidation, async (req: RequestWithParamsAndBody<{ id: string }, PostInputModel>, res: Response) => {
    let isUpdated = await postsRepository.updatePost(req.params.id, req.body);
    if (isUpdated) return res.sendStatus(CodeResponsesEnum.No_Content_204);
    return res.sendStatus(CodeResponsesEnum.Not_Found_404);
});
postsRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    let isDeleted = await postsRepository.deletePostById(req.params.id)
    if (isDeleted) {
        res.sendStatus(CodeResponsesEnum.No_Content_204);
    } else {
        res.sendStatus(CodeResponsesEnum.Not_Found_404);
    }
});