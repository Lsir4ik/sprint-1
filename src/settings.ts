import express from "express";
import {postsRouter} from "./routes/posts-router";
import {blogsRouter} from "./routes/blogs-router";
import {testingRouter} from "./routes/testing-router";

export const app = express();

app.use(express.json());

app.use('/posts', postsRouter);
app.use('/blogs', blogsRouter);
app.use('/testing/all-data', testingRouter);