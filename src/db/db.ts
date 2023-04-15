import {MongoClient} from "mongodb";
import dotenv from 'dotenv'
import {BlogViewModel} from "../models/BlogsModels/BlogViewModel";
import {PostViewModel} from "../models/PostsModels/PostViewModel";
import {UserDBModel} from "../models/UsersModels/UserDBModel";
import {CommentDBModel} from "../models/CommentsModels/CommentDBModel";


dotenv.config()

// Connection URL
// const url = process.env.MONGO_URL
const url = 'mongodb://0.0.0.0:27017' // local
console.log('url: ', url);
if (!url) {
    throw new Error('URL did not find')
}
export const client = new MongoClient(url);
const db = client.db('IncubTube');
export const blogsCollection = db.collection<BlogViewModel>('blogs');
export const postsCollection = db.collection<PostViewModel>('posts');
export const usersCollection = db.collection<UserDBModel>('users');
export const commentsCollection = db.collection<CommentDBModel>('comments')

export const runDb = async () => {
    try {
        await client.connect();
        await db.command({ping: 1})
        console.log('Connection successfully to server');
    } catch (e) {
        console.log('Don\'t connected successfully to server');
        await client.close()
    }
}