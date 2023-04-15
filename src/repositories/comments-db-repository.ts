import {commentsCollection} from "../db/db";
import {CommentDBModel} from "../models/CommentsModels/CommentDBModel";
import {CommentViewModel} from "../models/CommentsModels/CommentViewModel";
import {CommentUpdateModel} from "../models/CommentsModels/CommentUpdateModel";
import {ObjectId, WithId} from "mongodb";
import {CommentCreateModel} from "../models/CommentsModels/CommentCreateModel";
import {CommentatorInfo} from "../models/CommentsModels/CommentatorInfo";

function commentTypeMapping(comment: any): CommentViewModel {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt
    }
}
export const commentsRepository = {
    async sendFeedback(newComment: WithId<CommentCreateModel>): Promise<CommentViewModel> {
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
    },
    async updateComment(id: string, dataToUpdate: CommentUpdateModel): Promise<boolean> {
        const updateResult = await commentsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                content: dataToUpdate.content
            }
        })
        return updateResult.matchedCount === 1
    },
    async deleteCommentById(id: string): Promise<boolean> {
        const isDeleted = await commentsCollection.deleteOne({_id: new ObjectId(id)})
        return isDeleted.deletedCount === 1
    },
    async findCommentById(id: string): Promise<CommentViewModel | null>{
        const foundComment = await commentsCollection.findOne({_id: new ObjectId(id)})
        if (foundComment) return commentTypeMapping(foundComment)
        return null
    }
}