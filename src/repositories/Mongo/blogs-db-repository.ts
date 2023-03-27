import {BlogViewModel} from "../../models/BlogsModels/BlogViewModel";
import {BlogInputModel} from "../../models/BlogsModels/BlogInputModel";
import {blogsCollection, postsCollection} from "../../db/db";
import {ObjectId} from "mongodb";
import {PaginatorBlogViewModel} from "../../models/BlogsModels/PaginatorBlogViewModel";
import {PaginatorPostViewModel} from "../../models/PostsModels/PaginatorPostViewModel";
import {postTypeMapping} from "./posts-db-repository";

function blogTypeMapping(blog: any): BlogViewModel {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}

export const blogsRepository = {
    async findAllBlogs(): Promise<BlogViewModel[]> {
        const blogs = await blogsCollection.find().toArray()
        return blogs.map(blogTypeMapping);
    },
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        const foundBlog: BlogViewModel | null = await blogsCollection.findOne({_id: new ObjectId(id)})
        if (foundBlog) {
            return blogTypeMapping(foundBlog);
        } else {
            return null;
        }
    },
    async createBlog(newBlog: BlogViewModel): Promise<BlogViewModel> {
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

export const blogQueryRepository = {
    async pagingFindBlogs(searchNameTerm?: string,
                          sortBy?: string,
                          sortDirection?: string,
                          pageNumber?: string,
                          pageSize?: string): Promise<PaginatorBlogViewModel> {
        const dbSearchTerm = searchNameTerm || null
        const dbSortBy = sortBy || 'createdAt'
        // TODO почему не работает с if и let?
        const dbSortDirection = sortDirection ? sortDirection === 'asc' ? 1 : -1 : -1
        const dbPageNumber = pageNumber ? +pageNumber : 1
        const dbPageSize = pageSize ? +pageSize : 10
        const dbBlogsToSkip = (dbPageNumber - 1) * dbPageSize
        const dbSearchFilter = dbSearchTerm ? {name: {$regex: new RegExp(`${dbSearchTerm}`, 'i')}} : {}

        const foundBlogs = await blogsCollection.find(dbSearchFilter)
            .sort({[dbSortBy]: dbSortDirection})
            .skip(dbBlogsToSkip)
            .limit(dbPageSize)
            .toArray()
        const allFilteredBlogs = await blogsCollection.find(dbSearchFilter).toArray()
        const totalCountOfBlogs = allFilteredBlogs.length
        const pagesCountOfBlogs = Math.ceil(totalCountOfBlogs / dbPageSize)
        const formatFoundBlogs = foundBlogs.map(blogTypeMapping)
        return {
            pagesCount: pagesCountOfBlogs,
            page: dbPageNumber,
            pageSize: dbPageSize,
            totalCount: totalCountOfBlogs,
            items: formatFoundBlogs
        }
    },
    async getAllPostsOfBlog(blogId: string,
                            pageNumber?: number,
                            pageSize?: number,
                            sortBy?: string,
                            sortDirection?: string
    ): Promise<PaginatorPostViewModel | null> {
        const dbPageNumber = pageNumber ? +pageNumber : 1
        const dbPageSize = pageSize ? +pageSize : 10
        const dbSortBy = sortBy || 'createdAt'
        const dbSortDirection = sortDirection ? sortDirection === 'asc' ? 1 : -1 : -1
        const dbPostsToSkip = (dbPageNumber - 1) * dbPageSize

        const foundPostsOfBlog = await postsCollection.find({blogId: blogId})
            .sort({[dbSortBy]: dbSortDirection})
            .skip(dbPostsToSkip)
            .limit(dbPageSize)
            .toArray()
        if (foundPostsOfBlog.length === 0) {
            return null
        } else {
            const allPostsOfBlog = await postsCollection.find({blogId: blogId}).toArray()
            const totalCountOfPosts = allPostsOfBlog.length
            const pagesCountOfFoundedPosts = Math.ceil(totalCountOfPosts / dbPageSize)
            const formatFoundedPosts = foundPostsOfBlog.map(postTypeMapping)
            return {
                pagesCount: pagesCountOfFoundedPosts,
                page: dbPageNumber,
                pageSize: dbPageSize,
                totalCount: totalCountOfPosts,
                items: formatFoundedPosts

            }
        }
    }
}
