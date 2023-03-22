import {BlogViewModel} from "./BlogViewModel";

export type PaginatorBlogViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<BlogViewModel>
}