import {BlogViewModel} from "../../models/BlogsModels/BlogViewModel";
import {BlogInputModel} from "../../models/BlogsModels/BlogInputModel";
import {blogsCollection} from "../../db/db";
import {ObjectId} from "mongodb";

export const blogsRepository = {
    async findAllBlogs(): Promise<BlogViewModel[]> {
        const blogs = await blogsCollection.find().toArray()
        return blogs;
    },
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        const blog: BlogViewModel | null = await blogsCollection.findOne({_id: new ObjectId(id)})
        if (blog) {
            return blog;
        } else {
            return null;
        }
    },
    async createBlog(dataToCreate: BlogInputModel): Promise<BlogViewModel> {
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
    async updateBlog(id: string, dataToUpdate: BlogInputModel): Promise<boolean> {
        const updateResult = await blogsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: dataToUpdate.name,
                description: dataToUpdate.description,
                websiteUrl: dataToUpdate.websiteUrl,
            }
        })
        return updateResult.matchedCount === 1;
    },
    async deleteBlogById(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    async deleteAllBlogs(): Promise<void> {
        await blogsCollection.deleteMany({})
    },

}
