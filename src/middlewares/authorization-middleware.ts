import {NextFunction, Request, Response} from "express";
import {CodeResponsesEnum} from "../types/types";
import {atob} from "buffer";

const users = [
    {login: 'admin', password: 'qwerty'}
]

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.header(`Authorization`);
    if (authHeader) {
        const authTokens = authHeader.split(` `)
        console.log(authTokens[0]);
        if (authTokens[0] !== 'Basic') {
            res.sendStatus(CodeResponsesEnum.Unauthorized_401);
            return;
        } else {
            let [authLogin, authPassword] = atob(authTokens[1]).split(':')
            if (authLogin === users[0].login && authPassword === users[0].password) {
                next();
            } else {
                res.sendStatus(CodeResponsesEnum.Unauthorized_401);
                return;
            }
        }
    } else {
        res.sendStatus(CodeResponsesEnum.Unauthorized_401);
        return;
    }
}