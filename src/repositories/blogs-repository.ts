import {BlogViewModel} from "../models/BlogsModels/BlogViewModel";
import {BlogInputModel} from "../models/BlogsModels/BlogInputModel";

let blogs: Array<BlogViewModel> = [{
    id: "1",
    name: "Hello",
    description: "About",
    websiteUrl: "https://www.hello.com"
}];

export const blogsLocalRepository = {
    findAllBlogs(){
       return blogs;
    },
    findBlogById(id: Number): BlogViewModel | undefined{
        return blogs.find(b => +b.id === id)
    },
    createBlog(body: BlogInputModel){
        const newBlog: BlogViewModel = {
            id: new Date().getTime().toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
        }
        blogs.push(newBlog)
        return newBlog
    },
    updateBlog(id: Number, body: BlogInputModel): boolean{
        const blog = blogs.find(p => +p.id === id)
        if(blog) {
            blog.name = body.name;
            blog.description = body.description;
            blog.websiteUrl = body.websiteUrl;
            return true;
        } else {
            return false;
        }
    },
    deleteBlogById(id: Number): boolean{
        for (let i = 0; i < blogs.length; i++) {
            if(+blogs[i].id === id) {
                blogs.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    deleteAllBlogs(){
        blogs = [];
    },

}
