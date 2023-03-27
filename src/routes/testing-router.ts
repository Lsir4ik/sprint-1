import {Request, Response, Router} from "express";
import {CodeResponsesEnum} from "../types/types";
import {blogsRepository} from "../repositories/Mongo/blogs-db-repository";
import {postsRepository} from "../repositories/Mongo/posts-db-repository";
import {blogsService} from "../service/blog-service";
import {postsService} from "../service/post-service";

export const testingRouter = Router();

testingRouter.delete('/', async (req: Request, res: Response) => {
    await blogsService.deleteAllBlogs()
    await postsService.deleteAllPosts()
    res.sendStatus(CodeResponsesEnum.No_Content_204);
})
