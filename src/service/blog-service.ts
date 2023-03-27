import {BlogViewModel} from "../models/BlogsModels/BlogViewModel";
import {BlogInputModel} from "../models/BlogsModels/BlogInputModel";
import {PostViewModel} from "../models/PostsModels/PostViewModel";
import {BlogPostInputModel} from "../models/BlogsModels/BlogPostInputModel";
import {blogsRepository} from "../repositories/Mongo/blogs-db-repository";
import {postsRepository} from "../repositories/Mongo/posts-db-repository";

export const blogsService = {
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return blogsRepository.findBlogById(id)
    },
    async createBlog(dataToCreate: BlogInputModel): Promise<BlogViewModel> {
        const newBlog: BlogViewModel = {
            name: dataToCreate.name,
            description: dataToCreate.description,
            websiteUrl: dataToCreate.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }
        const createdBlog = await blogsRepository.createBlog(newBlog)
        return createdBlog
    },
    async updateBlog(id: string, dataToUpdate: BlogInputModel): Promise<boolean> {
        return blogsRepository.updateBlog(id, dataToUpdate)
    },
    async deleteBlogById(id: string): Promise<boolean> {
        const isDeleted = await blogsRepository.deleteBlogById(id)
        return isDeleted
    },
    async deleteAllBlogs(): Promise<void> {
        await blogsRepository.deleteAllBlogs()
    },
    async createPostForBlog(blogId: string, dataToCreate: BlogPostInputModel): Promise<PostViewModel | null> {
        const foundBlog = await blogsRepository.findBlogById(blogId)
        if (foundBlog) {
            const newPost: PostViewModel = {
                title: dataToCreate.title,
                shortDescription: dataToCreate.shortDescription,
                content: dataToCreate.content,
                createdAt: new Date().toISOString(),
                blogId: foundBlog.id,
                blogName: foundBlog.name,
            }
            const createdPost = await postsRepository.createPost(newPost)
            return createdPost
        }
        return null;
    },
}
