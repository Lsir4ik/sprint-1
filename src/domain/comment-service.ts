import {CommentViewModel} from "../models/CommentsModels/CommentViewModel";
import {usersService} from "./users-service";
import {CommentatorInfo} from "../models/CommentsModels/CommentatorInfo";
import {commentsRepository} from "../repositories/comments-db-repository";
import {CommentUpdateModel} from "../models/CommentsModels/CommentUpdateModel";
import {CommentCreateModel} from "../models/CommentsModels/CommentCreateModel";

export const commentsService = {
    async allFeedbacks() {

    },
    async sendFeedback(postId: string, content: string, userId: string): Promise<CommentViewModel | null> {
        const commentator = await usersService.findUserById(userId)
        if (commentator) {
            const commentatorInfo: CommentatorInfo = {
                userId: userId,
                userLogin: commentator?.login
            }
            const newComment: CommentCreateModel = {
                postId: postId,
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
    },
    async updateComment(id: string, dataToUpdate: CommentUpdateModel): Promise<boolean> {
        return commentsRepository.updateComment(id, dataToUpdate)
    },
    async deleteCommentById(id: string): Promise<boolean> {
        return commentsRepository.deleteCommentById(id)
    },
    async findCommentById(id:string): Promise<CommentViewModel | null>{
        return commentsRepository.findCommentById(id)
    }
}