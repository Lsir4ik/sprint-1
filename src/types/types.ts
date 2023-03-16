import {Request} from "express";

export enum CodeResponsesEnum {
    OK_200 = 200,
    Created_201 = 201,
    No_Content_204 = 204,
    Bad_Request_400 = 400,
    Unauthorized_401 = 401,
    Not_Found_404 = 404,

}

export type RequestWithParams<T> = Request<T>
export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>


export type FieldError = {
    message: string,
    field: string,
}
export type APIErrorResult = Array<FieldError>;