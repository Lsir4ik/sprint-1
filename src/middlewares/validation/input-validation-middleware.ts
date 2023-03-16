import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {CodeResponsesEnum} from "../../types/types";


export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(CodeResponsesEnum.Bad_Request_400).json({
            errorsMessages: errors.array({onlyFirstError: true}).map(error => {
                return {
                    message: error.msg,
                    field: error.param,
                }
            })
        });
    } else {
        next()
    }
}