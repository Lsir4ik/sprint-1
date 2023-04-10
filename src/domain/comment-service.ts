import {CommentViewModel} from "../models/CommentsModels/CommentViewModel";
import {CommentDBModel} from "../models/CommentsModels/CommentDBModel";
import {usersService} from "./users-service";

export const commentsService = {
    async allFeedbacks() {

    },
    // TODO Как убрать undefind при использовании не Request, а RequestWithParamsAndBody
    async sendFeedback(content: string, userId: string): Promise<CommentViewModel> {
        const commentator = await usersService.findUserById(userId)
        const newComment: CommentDBModel = {
            content: content,
            commentatorInfo:
        }
    }
}