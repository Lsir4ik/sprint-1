import {PaginatorUserViewModel} from "../models/UsersModels/PaginatorUserViewModel";
import {QueryUsersInputModel} from "../models/UsersModels/QueryUsersInputModel";
import {UserViewModel} from "../models/UsersModels/UserViewModel";
import {UserDBModel} from "../models/UsersModels/UserDBModel";
import {usersCollection} from "../db/db";
import {ObjectId, WithId} from "mongodb";
import {UserCreateModel} from "../models/UsersModels/UserCreateModel";

export function userTypeMapping(user: any): UserViewModel {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}
export const usersRepository = {
    async createUser(newUser: UserCreateModel): Promise<UserViewModel> {
        const createResult = await usersCollection.insertOne(newUser)
        return {
            id: createResult.insertedId.toString(),
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt,
        }
    },
    async deleteUserById(id: string): Promise<boolean> {
        const deleteResult = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return deleteResult.deletedCount === 1
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDBModel> | null> {
        const user = await usersCollection.findOne({$or: [{email: loginOrEmail},{login: loginOrEmail}]})
        return user
    },
    async findUserById(userId: string): Promise<UserViewModel | null> {
        const foundUser = await usersCollection.findOne({_Id: new ObjectId(userId)})
        return userTypeMapping(foundUser)
    },
    async deleteAllUsers(): Promise<void> {
        await usersCollection.deleteMany()
    }
}
export const usersQueryRepository = {
    // test
    async foundUsers(queryParameters: QueryUsersInputModel): Promise<PaginatorUserViewModel> {
        const {sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm} = queryParameters
        const dbSortBy = sortBy || 'createdAt'
        const dbSortDirection = sortDirection ? sortDirection === 'desc' ? -1 : 1 : -1
        const dbPageNumber = pageNumber ? +pageNumber : 1
        const dbPageSize = pageSize ? +pageSize : 10
        const dbUsersToSkip = (dbPageNumber - 1) * dbPageSize
        const dbSearchLoginTerm = searchLoginTerm || null
        const dbSearchEmailTerm = searchEmailTerm || null
        const dbLoginSearchRegex = new RegExp(`${dbSearchLoginTerm}`, 'i')
        const dbEmailSearchRegex = new RegExp(`${dbSearchEmailTerm}`, 'i')
        // TODO Пустой массив на уроке надо было пофиксить
        let dbSearchFilter = {}
        if (dbSearchLoginTerm) {
            if (dbSearchEmailTerm) {
                dbSearchFilter = {$or: [{login: {$regex: dbLoginSearchRegex}}, {email: {$regex: dbEmailSearchRegex}}]}
            } else {
                dbSearchFilter = {login: {$regex: dbLoginSearchRegex}}
            }
        } else {
            if (dbSearchEmailTerm) {
                dbSearchFilter = {email: {$regex: dbEmailSearchRegex}}
            } else {
                dbSearchFilter = {}
            }
        }
        /*const dbSearchFilter = []

        if(dbSearchLoginTerm) {
            dbSearchFilter.push({login: {$regex: dbLoginSearchRegex}})
        }

        if(dbSearchEmailTerm) {
            dbSearchFilter.push({email: {$regex: dbEmailSearchRegex}})
        }*/
        const foundUsers = await usersCollection.find(dbSearchFilter)
            .sort({[dbSortBy]: dbSortDirection})
            .skip(dbUsersToSkip)
            .limit(dbPageSize)
            .toArray()
        const totalCountOfUsers = await usersCollection.countDocuments(dbSearchFilter)
        const pagesCount = Math.ceil(totalCountOfUsers/dbPageSize)
        const formatFoundUsers = foundUsers.map(userTypeMapping)
        return {
            pagesCount: pagesCount,
            page: dbPageNumber,
            pageSize: dbPageSize,
            totalCount: totalCountOfUsers,
            items: formatFoundUsers,
        }
    }
}