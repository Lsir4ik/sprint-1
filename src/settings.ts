import express, {Request, Response} from "express";
import {postsRouter} from "./routes/posts-router";
import {blogsRouter} from "./routes/blogs-router";
import {blogsRepository} from "./repositories/Mongo/blogs-db-repository";
import {postsRepository} from "./repositories/Mongo/posts-db-repository";
import {CodeResponsesEnum} from "./types/types";

export const app = express();

app.use(express.json());
app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!!')
})
app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await blogsRepository.deleteAllBlogs()
    await postsRepository.deleteAllPosts()
    res.sendStatus(CodeResponsesEnum.No_Content_204);
})
app.use('/posts', postsRouter);
app.use('/blogs', blogsRouter);
