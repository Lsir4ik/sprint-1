import {NextFunction, Request, Response} from "express";
import {CodeResponsesEnum} from "../utils/utils";
import {jwtService} from "../domain/jwtService";
import {usersService} from "../domain/users-service";

// Bearer AUTH
export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) {
       res.sendStatus(CodeResponsesEnum.Unauthorized_401)
       return
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await usersService.findUserById(userId)
        next()
        return
    }
    res.sendStatus(CodeResponsesEnum.Unauthorized_401)
    return
}


// Basic AUTH

const users = [
    {login: 'admin', password: 'qwerty'}
]

let data = `${users[0].login}:${users[0].password}`
let buff = Buffer.from(data)
let base64data = buff.toString('base64')

export const authBasicMiddleware = (req: Request, res: Response, next: NextFunction) => {

    let authHeader = req.headers.authorization
    if (!authHeader) {
        res.send(401)
        return
    }
    if (authHeader && authHeader === `Basic ${base64data}`) {
        next()
    } else {
        res.send(401)
        return;
    }
//     const authHeader: string | undefined = req.header(`Authorization`);
//     console.log('test',authHeader);
//     if (authHeader) {
//         const authTokens = authHeader.split(` `)
//         if (authTokens[0] !== 'Basic') {
//             res.sendStatus(CodeResponsesEnum.Unauthorized_401);
//             return;
//         } else {
//             let [authLogin, authPassword] = atob(authTokens[1]).split(':')
//             if (authLogin === users[0].login && authPassword === users[0].password) {
//                 next();
//             } else {
//                 res.sendStatus(CodeResponsesEnum.Unauthorized_401);
//                 return;
//             }
//         }
//     } else {
//         res.sendStatus(CodeResponsesEnum.Unauthorized_401);
//         return;
//     }
}