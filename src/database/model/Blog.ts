import mongoose, { Schema } from 'mongoose'

interface BlogDoc {
    title: string
    content: string
    author: string
    category: string
    tags: [string]
    comments: [string]
}

const blogSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: String, required: true },
        category: { type: String },
        tags: [{ type: String }],
        comments: [{ type: String }]
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, rel) {
                delete rel._v
                delete rel.createdAt
                delete rel.updatedAt
            }
        }
    }
)

const Blog = mongoose.model<BlogDoc>('blog', blogSchema)

export default Blog
