import {Request, Response, Router} from "express";
import {CodeResponsesEnum} from "../utils/utils";
import {blogsService} from "../domain/blog-service";
import {postsService} from "../domain/post-service";
import {usersService} from "../domain/users-service";
import {commentsService} from "../domain/comment-service";

export const testingRouter = Router();

testingRouter.delete('/', async (req: Request, res: Response) => {
    await blogsService.deleteAllBlogs()
    await postsService.deleteAllPosts()
    await usersService.deleteAllUsers()
    await commentsService.deleteAllComments()
    res.sendStatus(CodeResponsesEnum.No_Content_204);
})
