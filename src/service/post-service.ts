import {PostViewModel} from "../models/PostsModels/PostViewModel";
import {PostInputModel} from "../models/PostsModels/PostInputModel";
import {postsRepository} from "../repositories/Mongo/posts-db-repository";
import {blogsRepository} from "../repositories/Mongo/blogs-db-repository";

export const postsService = {
    async findPostById(id: string): Promise<PostViewModel | null> {
        return await postsRepository.findPostById(id)
    },
    async createPost(dataToCreate: PostInputModel): Promise<PostViewModel | null> {
        const blogNameById = await blogsRepository.findBlogById(dataToCreate.blogId)
        if (blogNameById) {
            const newPost: PostViewModel = {
                title: dataToCreate.title,
                shortDescription: dataToCreate.shortDescription,
                content: dataToCreate.content,
                createdAt: new Date().toISOString(),
                blogId: blogNameById.id,
                blogName: blogNameById.name,
            }
            const createdPost = await postsRepository.createPost(newPost)
            return createdPost
        }
        return null;
    },
    async updatePost(id: string, dataToUpdate: PostInputModel): Promise<boolean> {
        return postsRepository.updatePost(id, dataToUpdate)
    },
    async deletePostById(id: string): Promise<boolean> {
        const isDeleted = await postsRepository.deletePostById(id)
        return isDeleted
    },
    async deleteAllPosts(): Promise<void> {
        await postsRepository.deleteAllPosts()
    }
}