import {PostViewModel} from "./PostViewModel";

export type PaginatorPostViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<PostViewModel>
}