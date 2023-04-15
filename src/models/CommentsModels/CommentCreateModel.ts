import {CommentatorInfo} from "./CommentatorInfo";

export type CommentCreateModel = {
    postId: string,
    content: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string
}