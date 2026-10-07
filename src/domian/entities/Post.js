class post{
    constructor({id,title,content,createdAt}){
        if (!title || title.trim().length === 0) {
            throw new Error("Post title is required.");
        }
        if(!content||content.trim().length ===0)    
            throw new Error("post contnet is required")
         this.id=id;
        this.title=title;
        this.content=content;
        this.createdAt=createdAt|| new Date()
    }
}
module.exports = Post;