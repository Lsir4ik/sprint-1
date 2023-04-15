import {commentsCollection} from "../db/db";
import {CommentDBModel} from "../models/CommentsModels/CommentDBModel";
import {CommentViewModel} from "../models/CommentsModels/CommentViewModel";

export const commentsRepository = {
    async sendFeedback(newComment: CommentDBModel): Promise<CommentViewModel> {
        const createResult = await commentsCollection.insertOne(newComment)
        return {
            id: createResult.insertedId.toString(),
            content: newComment.content,
            commentatorInfo: newComment.commentatorInfo,
            createdAt: newComment.createdAt
        }
    },
    async deleteAllComments() {
        await commentsCollection.deleteMany()
    }
}