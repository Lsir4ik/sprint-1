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
        console.log(passwordSalt);
        const passwordHashed = await this._generateHash(password, passwordSalt)
        console.log(passwordHashed);

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
        const saltFromHashedPassword = user.passwordHash.slice(0, 29)
        console.log(saltFromHashedPassword);
        const passwordHash = await this._generateHash(password, saltFromHashedPassword)

        return user.passwordHash === passwordHash;

    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async deleteUserById(id: string): Promise<boolean> {
        const isDeleted = await usersRepository.deleteUserById(id)
        return isDeleted
    },
    async deleteAllUsers(): Promise<void> {
        await usersRepository.deleteAllUsers()
    }
}