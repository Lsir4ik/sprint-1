import {CommentatorInfo} from "./CommentatorInfo";

export type CommentDBModel = {
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string

}