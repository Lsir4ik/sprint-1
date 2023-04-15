import {Response, Request, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types/types";
import {CodeResponsesEnum} from "../utils/utils";
import {PostInputModel} from "../models/PostsModels/PostInputModel";
import {authBasicMiddleware, authBearerMiddleware} from "../middlewares/authorization-middleware";
import {createPostValidation, updatePostValidation} from "../middlewares/validation/posts/posts-validation.middleware";
import {postQueryRepository} from "../repositories/posts-db-repository";
import {QueryPostInputModel} from "../models/PostsModels/QueryPostInputModel";
import {postsService} from "../domain/post-service";
import {commentsService} from "../domain/comment-service";
import {createCommentValidation} from "../middlewares/validation/comments/comments-validation-middleware";

export const postsRouter = Router();
postsRouter.get('/', async (req, res) => {
    const users = await commentsService.allFeedbacks()
    res.send(users)
});
postsRouter.post('/:id/comments', authBearerMiddleware, createCommentValidation, async (req:Request, res: Response) => {
    const foundPost = await postsService.findPostById(req.params.id)
    if (!foundPost) return res.sendStatus(CodeResponsesEnum.Not_Found_404)

    const createdComment = await commentsService.sendFeedback(req.body.content, req.user!.id)
    return res.status(CodeResponsesEnum.Created_201).send(createdComment)
});

postsRouter.get('/', async (req: RequestWithQuery<QueryPostInputModel>, res: Response) => {
    const foundPosts = await postQueryRepository.pagingFindPosts(
        req.query.pageNumber,
        req.query.pageSize,
        req.query.sortBy,
        req.query.sortDirection
    )
    res.status(CodeResponsesEnum.OK_200).send(foundPosts);
});
postsRouter.post('/', authBasicMiddleware, createPostValidation, async (req: RequestWithBody<PostInputModel>, res: Response) => {
    const newPost = await postsService.createPost(req.body);
    if (!newPost) return res.sendStatus(CodeResponsesEnum.Not_Found_404);
    return res.status(CodeResponsesEnum.Created_201).send(newPost);
});
postsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const newPost = await postsService.findPostById(req.params.id);
    if (newPost) return res.status(CodeResponsesEnum.OK_200).send(newPost);
    return res.sendStatus(CodeResponsesEnum.Not_Found_404);
});
postsRouter.put('/:id', authBasicMiddleware, updatePostValidation, async (req: RequestWithParamsAndBody<{ id: string }, PostInputModel>, res: Response) => {
    let isUpdated = await postsService.updatePost(req.params.id, req.body);
    if (isUpdated) return res.sendStatus(CodeResponsesEnum.No_Content_204);
    return res.sendStatus(CodeResponsesEnum.Not_Found_404);
});
postsRouter.delete('/:id', authBasicMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    let isDeleted = await postsService.deletePostById(req.params.id)
    if (isDeleted) return res.sendStatus(CodeResponsesEnum.No_Content_204);
    return res.sendStatus(CodeResponsesEnum.Not_Found_404);

});