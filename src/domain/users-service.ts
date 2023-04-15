import {UserViewModel} from "../models/UsersModels/UserViewModel";
import {UserInputModel} from "../models/UsersModels/UserInputModel";
import bcrypt from "bcrypt";
import {usersRepository, userTypeMapping} from "../repositories/users-db-repository";
import {LoginInputModel} from "../models/AuthModels/LoginInputModel";
import {MeViewModel} from "../models/AuthModels/MeViewModel";
import {UserCreateModel} from "../models/UsersModels/UserCreateModel";

export const usersService = {
    async createUser(dataToCreateUser: UserInputModel): Promise<UserViewModel> {
        const {login, password, email} = dataToCreateUser
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHashed = await this._generateHash(password)

        const newUser: UserCreateModel = {
            login: login,
            email: email,
            passwordHash: passwordHashed,
            createdAt: new Date().toISOString()
        }
        return usersRepository.createUser(newUser)
    },
    async checkCredentials(dataToCheck: LoginInputModel): Promise<UserViewModel | null> {
        const {loginOrEmail, password} = dataToCheck
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return null
        const saltFromHashedPassword = user.passwordHash.slice(0, 29)
        const passwordHash = await this._generateHash(password)

        if (user.passwordHash === passwordHash) return userTypeMapping(user)
        return null

    },
    async _generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },
    async findUserById(userId: string): Promise<UserViewModel | null> {
        const foundUser = await usersRepository.findUserById(userId)
        if (foundUser) return foundUser
        return null
    },
    async findMeById(userId: string): Promise<MeViewModel | null> {
        const foundUser = await usersRepository.findUserById(userId)
        if (foundUser) return {
            email: foundUser.email,
            login: foundUser.login,
            userId: userId
        }
        return null
    },
    async deleteUserById(id: string): Promise<boolean> {
        const isDeleted = await usersRepository.deleteUserById(id)
        return isDeleted
    },
    async deleteAllUsers(): Promise<void> {
        await usersRepository.deleteAllUsers()
    }
}