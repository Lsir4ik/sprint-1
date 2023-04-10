import {Router, Response, Request} from "express";
import {RequestWithBody} from "../types/types";
import {LoginInputModel} from "../models/AuthModels/LoginInputModel";
import {CodeResponsesEnum} from "../utils/utils";
import {usersService} from "../domain/users-service";
import {loginInputValidation} from "../middlewares/auth-middleware";
import {jwtService} from "../domain/jwtService";
import {authBasicMiddleware, authBearerMiddleware} from "../middlewares/authorization-middleware";

export const authRouter = Router();

authRouter.post('/', loginInputValidation, async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    const user = await usersService.checkCredentials(req.body)
    if (user) {
        const token = await jwtService.createJWT(user)
        res.status(CodeResponsesEnum.OK_200).send(token)
    } else {
        res.sendStatus(CodeResponsesEnum.Unauthorized_401)
    }
})
authRouter.get('/', authBearerMiddleware, async (req: Request, res: Response) => {
    if (req.headers.authorization) {
        const myToken = req.headers.authorization.split(' ')[1]
        const foundUserId = await jwtService.getUserIdByToken(myToken)
        const meInformation = await usersService.findMeById(foundUserId)
        return res.sendStatus(CodeResponsesEnum.OK_200).send(meInformation)
    }
    return res.sendStatus(CodeResponsesEnum.Unauthorized_401)

})