import {Request, Response, Router} from "express";
import {createCommentValidation} from "../middlewares/validation/comments/comments-validation-middleware";
import {commentsService} from "../domain/comment-service";
import {authBearerMiddleware} from "../middlewares/authorization-middleware";
import {CodeResponsesEnum} from "../utils/utils";
import {Code} from "mongodb";

export const commentsRouter = Router()

commentsRouter.put('/:id', authBearerMiddleware, createCommentValidation, async (req: Request, res: Response) => {
    const isUpdated = await commentsService.updateComment(req.params.id, req.body)
    if (isUpdated) return res.sendStatus(CodeResponsesEnum.No_Content_204)
    return res.sendStatus(CodeResponsesEnum.Not_Found_404)
    // TODO 403
})
commentsRouter.delete('/:id', authBearerMiddleware, async (req: Request, res: Response) => {
    const isDeleted = await commentsService.deleteCommentById(req.params.id)
    if (isDeleted) return res.sendStatus(CodeResponsesEnum.No_Content_204)
    return res.sendStatus(CodeResponsesEnum.Not_Found_404)
})
commentsRouter.get('/:id', async (req:Request, res: Response) => {
    const foundComment = await commentsService.findCommentById(req.params.id)
    if (foundComment) return res.sendStatus(CodeResponsesEnum.OK_200).send(foundComment)
    return res.sendStatus(CodeResponsesEnum.Not_Found_404)
})