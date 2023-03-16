import express, {Request, Response} from "express";
import {CodeResponsesEnum} from "./types/types";
import {blogsLocalRepository} from "./repositories/blogs-repository";
import {postsRouter} from "./routes/posts-router";
import {blogsRouter} from "./routes/blogs-router";
import {postLocalRepository} from "./repositories/posts-repository";

export const app = express();

app.use(express.json());
app.use('/posts', postsRouter);
app.use('/blogs', blogsRouter);
app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!!')
})
app.delete('/testing/all-data', (req:Request, res:Response) => {
    blogsLocalRepository.deleteAllBlogs();
    postLocalRepository.deleteAllPosts();
    res.sendStatus(CodeResponsesEnum.No_Content_204);
})