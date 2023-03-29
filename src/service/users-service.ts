import {UserViewModel} from "../models/UsersModels/UserViewModel";
import {UserInputModel} from "../models/UsersModels/UserInputModel";
import bcrypt from "bcrypt";
import {UserDBType} from "../models/UsersModels/UserDBType";
import {usersRepository} from "../repositories/Mongo/users-db-repository";
import {LoginInputModel} from "../models/AuthModels/LoginInputModel";

export const usersService = {
    async createUser(dataToCreateUser: UserInputModel): Promise<UserViewModel> {
        const {login, password, email} = dataToCreateUser
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHashed = await this._generateHash(password, passwordSalt)

        const newUser: UserDBType = {
            login: login,
            email: email,
            passwordHash: passwordHashed,
            createdAt: new Date().toISOString()
        }
        return usersRepository.createUser(newUser)
    },
    async checkCredentials(dataToCheck: LoginInputModel): Promise<boolean> {
        const {loginOrEmail, password} = dataToCheck
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const saltFromHashedPassword = user.passwordHash.split('$')[3].slice(0, 22)
        const passwordHash = await this._generateHash(password, saltFromHashedPassword)
        return saltFromHashedPassword === passwordHash;

    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async deleteUserById(id: string): Promise<boolean> {
        const isDeleted = await usersRepository.deleteUserById(id)
        return isDeleted
    }
}