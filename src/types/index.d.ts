import {UserDBType} from "../models/UsersModels/UserDBType";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserDBType | null
        }
    }
}
