import {Request, Response, Router} from "express";
import {createCommentValidation} from "../middlewares/validation/comments/comments-validation-middleware";
import {commentsService} from "../domain/comment-service";
import {authBearerMiddleware} from "../middlewares/authorization-middleware";
import {CodeResponsesEnum} from "../utils/utils";

export const commentsRouter = Router()

// TODO Добавить типизацию в Request
commentsRouter.put('/:id', authBearerMiddleware, createCommentValidation, async (req: Request, res: Response) => {
    const commentById = await commentsService.findCommentById(req.params.id)
    if (!commentById) return res.sendStatus(CodeResponsesEnum.Not_Found_404)
    if (req.user!.id !== commentById.commentatorInfo.userId) return res.sendStatus(CodeResponsesEnum.Forbidden_403)
    const isUpdated = await commentsService.updateComment(req.params.id, req.body)
    if (isUpdated) return res.sendStatus(CodeResponsesEnum.No_Content_204)
    return res.sendStatus(CodeResponsesEnum.Not_Found_404)
})
commentsRouter.delete('/:id', authBearerMiddleware, async (req: Request, res: Response) => {
    const commentById = await commentsService.findCommentById(req.params.id)
    if (!commentById) return res.sendStatus(CodeResponsesEnum.Not_Found_404)
    if (req.user!.id !== commentById.commentatorInfo.userId) return res.sendStatus(CodeResponsesEnum.Forbidden_403)
    const isDeleted = await commentsService.deleteCommentById(req.params.id)
    if (isDeleted) return res.sendStatus(CodeResponsesEnum.No_Content_204)
    return res.sendStatus(CodeResponsesEnum.Not_Found_404)
})
commentsRouter.get('/:id', async (req:Request, res: Response) => {
    const foundComment = await commentsService.findCommentById(req.params.id)
    if (foundComment) return res.sendStatus(CodeResponsesEnum.OK_200).send(foundComment)
    return res.sendStatus(CodeResponsesEnum.Not_Found_404)
})