/*
import {PostViewModel} from "../../models/PostsModels/PostViewModel";
import {PostInputModel} from "../../models/PostsModels/PostInputModel";
import {blogsLocalRepository} from "./blogs-in-memory-repository";

let posts: Array<PostViewModel> = [{
    id: '1',
    title: 'string',
    shortDescription: 'string',
    content: 'string',
    blogId: 'string',
    blogName: 'string'
}];

export const postLocalRepository = {
    findAllPosts() {
        return posts;
    },
    findPostById(id: Number) {
        return posts.find(b => +b.id === id)
    },

    createPost(body: PostInputModel): PostViewModel | null {
        const blogNameById = blogsLocalRepository.findBlogById(+body.blogId)
        if (blogNameById) {
            const newPost: PostViewModel = {
                id: new Date().getTime().toString(),
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: blogNameById.name,
            }
            posts.push(newPost);
            return newPost;
        }
        return null;

    },
    updatePost(id: Number, body: PostInputModel) {
        const post = posts.find(p => +p.id === id)
        if (post) {
            post.title = body.title;
            post.shortDescription = body.shortDescription;
            post.content = body.content;
            post.blogId = body.blogId;
            return true;
        } else {
            return false;
        }
    },
    deletePostById(id: Number) {
        for (let i = 0; i < posts.length; i++) {
            if (+posts[i].id === id) {
                posts.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    deleteAllPosts(){
        posts = [];
    }
}

 */