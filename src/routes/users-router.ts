import {Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/types";
import {QueryUsersInputModel} from "../models/UsersModels/QueryUsersInputModel";
import {UserInputModel} from "../models/UsersModels/UserInputModel";
import {usersQueryRepository} from "../repositories/users-db-repository";
import {CodeResponsesEnum} from "../utils/utils";
import {usersService} from "../domain/users-service";
import {authBasicMiddleware} from "../middlewares/authorization-middleware";
import {createUserValidation} from "../middlewares/validation/login-middleware";

export const usersRouter = Router();

usersRouter.get('/', async (req: RequestWithQuery<QueryUsersInputModel>, res: Response) => {
    const foundUsers = await usersQueryRepository.foundUsers(
        req.query)
    if (foundUsers) return res.status(CodeResponsesEnum.OK_200).send(foundUsers)
    return res.sendStatus(CodeResponsesEnum.Unauthorized_401)
})
usersRouter.post('/', authBasicMiddleware, createUserValidation, async (req: RequestWithBody<UserInputModel>, res: Response) => {
    const newUser = await usersService.createUser(req.body)
    //queryREpo.getUserById(createdUserId)

    // TODO не возвращать весь тип (только ID)
    res.status(CodeResponsesEnum.Created_201).send(newUser)
})
usersRouter.delete('/:id', authBasicMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const isDelete = await usersService.deleteUserById(req.params.id)
    if (isDelete) return res.sendStatus(CodeResponsesEnum.No_Content_204)
    return res.sendStatus(CodeResponsesEnum.Not_Found_404)
})