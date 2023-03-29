import {Router, Response} from "express";
import {RequestWithBody} from "../types/types";
import {LoginInputModel} from "../models/AuthModels/LoginInputModel";
import {CodeResponsesEnum} from "../utils/utils";
import {usersService} from "../service/users-service";

export const authRouter = Router();

authRouter.post('/', async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    const checkResult = await usersService.checkCredentials(req.body)
    if (checkResult) return res.sendStatus(CodeResponsesEnum.No_Content_204)
    return res.sendStatus(CodeResponsesEnum.Unauthorized_401)
})