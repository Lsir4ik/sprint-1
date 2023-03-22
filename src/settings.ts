import express, {Request, Response} from "express";
import {postsRouter} from "./routes/posts-router";
import {blogsRouter} from "./routes/blogs-router";
import {testingRouter} from "./routes/testing-router";

export const app = express();

app.use(express.json());
app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!!')
})
app.use('/testing/all-data', testingRouter)
app.use('/posts', postsRouter);
app.use('/blogs', blogsRouter);
