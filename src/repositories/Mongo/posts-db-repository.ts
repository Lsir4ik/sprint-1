import {PostViewModel} from "../../models/PostsModels/PostViewModel";
import {PostInputModel} from "../../models/PostsModels/PostInputModel";
import {blogsCollection, postsCollection} from "../../db/db";
import {ObjectId} from "mongodb";

export const postsRepository = {
    async findAllPosts(): Promise<PostViewModel[]> {
        const posts = await postsCollection.find().toArray()
        return posts;
    },
    async findPostById(id: string): Promise<PostViewModel | null> {
        const foundPost = await postsCollection.findOne({_id: new ObjectId(id)});
        if (foundPost) {
            return foundPost;
        } else {
            return null;
        }
    },
    async createPost(dataToCreate: PostInputModel): Promise<PostViewModel | null> {
        const blogNameById = await blogsCollection.findOne({_id: new ObjectId(dataToCreate.blogId)})
        if (blogNameById) {
            const newPost: PostViewModel = {
                title: dataToCreate.title,
                shortDescription: dataToCreate.shortDescription,
                content: dataToCreate.content,
                blogId: dataToCreate.blogId,
                blogName: blogNameById.name,
                createdAt: new Date().toISOString(),
            }
            const createResult = await postsCollection.insertOne(newPost)
            return {
                id: createResult.insertedId.toString(),
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                createdAt: newPost.createdAt,
                blogId: newPost.blogId,
                blogName: newPost.blogName
            };
        }
        return null;

    },
    async updatePost(id: string, dataToUpdate: PostInputModel): Promise<boolean> {
        const updateResult = await postsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: dataToUpdate.title,
                shortDescription: dataToUpdate.shortDescription,
                content: dataToUpdate.content,
            }
        })
        return updateResult.matchedCount === 1;
    },
    async deletePostById(id: string): Promise<boolean> {
        const deleteResult = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return deleteResult.deletedCount === 1;
    },
    async deleteAllPosts(): Promise<void> {
        await postsCollection.deleteMany({})
    }
}