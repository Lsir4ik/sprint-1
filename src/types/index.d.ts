import {UserViewModel} from "../models/UsersModels/UserViewModel";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserViewModel | null
        }
    }
}
