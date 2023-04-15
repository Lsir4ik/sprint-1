import {CommentatorInfo} from "./CommentatorInfo";
import {ObjectId} from "mongodb";

export type CommentDBModel = {
    _id: ObjectId
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string

}