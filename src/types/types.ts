import {Request} from "express";


export type RequestWithParams<T> = Request<T>
export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>
export type RequestWithParamsAndQuery<T, B> = Request<T, {},{}, B>

export type FieldError = {
    message: string,
    field: string,
}
export type APIErrorResult = Array<FieldError>;