import {CommentViewModel} from "./CommentViewModel";

export type PaginatorCommentViewModel = {
    pagesCount: string
    page: string
    pageSize: string
    totalCount: string
    items: Array<CommentViewModel>
}