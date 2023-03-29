import {Request, Response, Router} from "express";
import {CodeResponsesEnum} from "../utils/utils";
import {blogsService} from "../service/blog-service";
import {postsService} from "../service/post-service";

export const testingRouter = Router();

testingRouter.delete('/', async (req: Request, res: Response) => {
    await blogsService.deleteAllBlogs()
    await postsService.deleteAllPosts()
    res.sendStatus(CodeResponsesEnum.No_Content_204);
})
