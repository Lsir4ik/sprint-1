import jwt from 'jsonwebtoken'
import {LoginSuccessViewModel} from "../models/AuthModels/LoginSuccessViewModel";
import {UserViewModel} from "../models/UsersModels/UserViewModel";
import dotenv from "dotenv";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || "Pass321PJWT"
export const jwtService = {
    async createJWT(user: UserViewModel): Promise<LoginSuccessViewModel> {
        const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn:'1h'})
        return {
            accessToken: token
        }
    },
    async getUserIdByToken(token: string) {
        try {
            const result = jwt.verify(token, JWT_SECRET) as {userId: string}
            return result.userId
        } catch (error) {
            return null
        }
    }
}
