import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {LoginInputModel} from "../models/AuthModels/LoginInputModel";
import {CodeResponsesEnum} from "../utils/utils";
import {usersService} from "../domain/users-service";
import {loginInputValidation} from "../middlewares/validation/login-middleware";
import {jwtService} from "../domain/jwtService";
import {authBearerMiddleware} from "../middlewares/authorization-middleware";

export const authRouter = Router();

authRouter.post('/', loginInputValidation, async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    const user = await usersService.checkCredentials(req.body)
    if (user) {
        const token = await jwtService.createJWT(user)
        res.status(CodeResponsesEnum.OK_200).send(token)
    } else {
        res.sendStatus(CodeResponsesEnum.Unauthorized_401)
        return
    }
})
authRouter.get('/', authBearerMiddleware, async (req: Request, res: Response) => {
        const meInformation = await usersService.findMeById(req.user!.id)
        return res.sendStatus(CodeResponsesEnum.OK_200).send(meInformation)
})