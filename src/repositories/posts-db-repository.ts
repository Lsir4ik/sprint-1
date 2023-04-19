import {PostViewModel} from "../models/PostsModels/PostViewModel";
import {PostInputModel} from "../models/PostsModels/PostInputModel";
import {commentsCollection, postsCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {PaginatorPostViewModel} from "../models/PostsModels/PaginatorPostViewModel";
import {PaginatorCommentInputModel} from "../models/CommentsModels/PaginatorCommentInputModel";
import {PaginatorCommentViewModel} from "../models/CommentsModels/PaginatorCommentViewModel";
import {commentTypeMapping} from "./comments-db-repository";
import {PaginatorPostInputModel} from "../models/PostsModels/PaginatorPostInputModel";

export function postTypeMapping(post: any): PostViewModel {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        createdAt: post.createdAt,
        blogId: post.blogId,
        blogName: post.blogName,
    }
}

export const postsRepository = {
    async findAllPosts(): Promise<PostViewModel[]> {
        const posts = await postsCollection.find().toArray()
        return posts.map(post => postTypeMapping(post));
    },
    async findPostById(id: string): Promise<PostViewModel | null> {
        const foundPost = await postsCollection.findOne({_id: new ObjectId(id)});
        if (foundPost) {
            return postTypeMapping(foundPost);
        } else {
            return null;
        }
    },
    async createPost(newPost: PostViewModel): Promise<PostViewModel | null> {
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
export const postQueryRepository = {
    async pagingFindPosts(pagingData: PaginatorPostInputModel): Promise<PaginatorPostViewModel> {
        const {pageNumber, pageSize, sortBy, sortDirection} = pagingData
        const dbPageNumber = pageNumber ? +pageNumber : 1
        const dbPageSize = pageSize ? +pageSize : 10
        const dbSortBy = sortBy || 'createdAt'
        const dbSortDirection = sortDirection ? sortDirection === 'asc' ? 1 : -1 : -1
        const dbPostsToSkip = (dbPageNumber - 1) * dbPageSize

        const foundPosts = await postsCollection.find()
            .sort({[dbSortBy]: dbSortDirection})
            .skip(dbPostsToSkip)
            .limit(dbPageSize)
            .toArray()
        const allFoundPosts = await postsCollection.find().toArray()
        const totalCountOfPosts = allFoundPosts.length
        const pagesCountOfPosts = Math.ceil(totalCountOfPosts / dbPageSize)
        const formatFoundPosts = foundPosts.map(postTypeMapping)
        return {
            pagesCount: pagesCountOfPosts,
            page: dbPageNumber,
            pageSize: dbPageSize,
            totalCount: totalCountOfPosts,
            items: formatFoundPosts
        }
    },
    async findCommentsOfPost(id: string, paggingData: PaginatorCommentInputModel): Promise<PaginatorCommentViewModel> {
        const {pageNumber, pageSize, sortBy, sortDirection} = paggingData
        const dbPageNumber = pageNumber ? +pageNumber : 1
        const dbPageSize = pageSize ? +pageSize : 1
        const dbSortBy = sortBy || 'createdAt'
        const dbSortDirection = sortDirection ? sortDirection === 'asc' ? 1 : -1 : -1
        const dbCommentsToSkip = (dbPageNumber - 1) * dbPageSize

        const foundCommentsOfPost = await commentsCollection.find({postId: id})
            .sort({[dbSortBy]: dbSortDirection})
            .skip(dbCommentsToSkip)
            .limit(dbPageSize)
            .toArray()

        const totalCountOfCommentsOfPost = await commentsCollection.countDocuments({postId: id})
        const pagesCountOfCommentsOfPost = Math.ceil(totalCountOfCommentsOfPost / dbPageSize)
        const formatFoundCommentsOfPost = foundCommentsOfPost.map(commentTypeMapping)
        return {
            pagesCount: pagesCountOfCommentsOfPost,
            page: dbPageNumber,
            pageSize: dbPageSize,
            totalCount: totalCountOfCommentsOfPost,
            items: formatFoundCommentsOfPost
        }
    }
}