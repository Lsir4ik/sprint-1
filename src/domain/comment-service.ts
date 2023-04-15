import {CommentViewModel} from "../models/CommentsModels/CommentViewModel";
import {CommentDBModel} from "../models/CommentsModels/CommentDBModel";
import {usersService} from "./users-service";
import {CommentatorInfo} from "../models/CommentsModels/CommentatorInfo";
import {commentsRepository} from "../repositories/comments-db-repository";

export const commentsService = {
    async allFeedbacks() {

    },
    // TODO FIX with ID user all types
    async sendFeedback(content: string, userId: string): Promise<CommentViewModel | null> {
        const commentator = await usersService.findUserById(userId)
        if (commentator) {
            const commentatorInfo: CommentatorInfo = {
                userId: userId,
                userLogin: commentator?.login
            }
            const newComment: CommentDBModel = {
                content: content,
                commentatorInfo: commentatorInfo,
                createdAt: new Date().toISOString()
            }
            const createdComment = await commentsRepository.sendFeedback(newComment)
            return createdComment
        }
        return null
    },
    async deleteAllComments() {
        await commentsRepository.deleteAllComments()
    }
}