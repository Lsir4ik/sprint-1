/*
import {BlogInputModel} from "../models/BlogsModels/BlogInputModel";
import {BlogViewModel} from "../models/BlogsModels/BlogViewModel";
import {blogsCollection, postsCollection} from "../db/db";
import {BlogPostInputModel} from "../models/BlogsModels/BlogPostInputModel";
import {PostViewModel} from "../models/PostsModels/PostViewModel";
import {ObjectId} from "mongodb";

export const createBlogService = {
    async createNewBlog(dataToCreate: BlogInputModel): Promise<BlogViewModel> {
        const newBlog: BlogViewModel = {
            name: dataToCreate.name,
            description: dataToCreate.description,
            websiteUrl: dataToCreate.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }
        const createResult = await blogsCollection.insertOne(newBlog)
        return {
            id: createResult.insertedId.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
    },
    async createPostForBlog(blogId: string, dataToCreate: BlogPostInputModel): Promise<PostViewModel | null> {
        const foundBlog = await blogsCollection.findOne({_id: new ObjectId(blogId)})
        if (foundBlog) {
            const newPost: PostViewModel = {
                title: dataToCreate.title,
                shortDescription: dataToCreate.shortDescription,
                content: dataToCreate.content,
                createdAt: new Date().toISOString(),
                blogId: foundBlog._id.toString(),
                blogName: foundBlog.name,
            }
            const createResult = await postsCollection.insertOne(newPost)
            return {
                id: createResult.insertedId.toString(),
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                createdAt: newPost.createdAt,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
            };
        }
        return null;

    },
}

 */
