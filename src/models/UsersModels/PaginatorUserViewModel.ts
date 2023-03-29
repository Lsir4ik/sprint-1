import {UserViewModel} from "./UserViewModel";

export type PaginatorUserViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<UserViewModel>
}