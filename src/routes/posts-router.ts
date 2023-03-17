import {Response, Router} from "express";
import {
    CodeResponsesEnum,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../types/types";
import {postLocalRepository} from "../repositories/posts-repository";
import {PostInputModel} from "../models/PostsModels/PostInputModel";
import {authMiddleware} from "../middlewares/authorization-middleware";
import {createPostValidation, updatePostValidation} from "../middlewares/validation/posts/posts-validation.middleware";

export const postsRouter = Router();

postsRouter.get('/', (req: RequestWithQuery<{ name: string }>, res: Response) => {
    const foundPosts = postLocalRepository.findAllPosts()
    res.status(CodeResponsesEnum.OK_200).send(foundPosts);
});
postsRouter.post('/', authMiddleware, createPostValidation, (req: RequestWithBody<PostInputModel>, res: Response) => {
    const newPost = postLocalRepository.createPost(req.body);
    if (!newPost) return res.sendStatus(CodeResponsesEnum.Not_Found_404);
    return res.status(CodeResponsesEnum.Created_201).send(newPost);
});
postsRouter.get('/:id', (req: RequestWithParams<{ id: string }>, res: Response) => {
    const newPost = postLocalRepository.findPostById(+req.params.id);
    res.status(CodeResponsesEnum.OK_200).send(newPost);
});
postsRouter.put('/:id', authMiddleware, updatePostValidation, (req: RequestWithParamsAndBody<{ id: string }, PostInputModel>, res: Response) => {
    let isUpdated = postLocalRepository.updatePost(+req.params.id, req.body);
    if (isUpdated) return res.sendStatus(CodeResponsesEnum.No_Content_204);
    return res.sendStatus(CodeResponsesEnum.Not_Found_404);
});
postsRouter.delete('/:id', authMiddleware, (req: RequestWithParams<{ id: string }>, res: Response) => {
    let isDeleted = postLocalRepository.deletePostById(+req.params.id)
    if (isDeleted) {
        res.sendStatus(CodeResponsesEnum.No_Content_204);
    } else {
        res.sendStatus(CodeResponsesEnum.Not_Found_404);
    }
});