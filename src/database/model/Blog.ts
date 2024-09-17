import mongoose, { Schema } from 'mongoose'

interface BlogDoc {
    title: string
    content: string
    author: mongoose.Types.ObjectId
    category: mongoose.Types.ObjectId[]
    tags: mongoose.Types.ObjectId[]
    comments: mongoose.Types.ObjectId[]
}

const blogSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, required: true },
        category: [{ type: Schema.Types.ObjectId, ref: 'category' }],
        tags: [{ type: Schema.Types.ObjectId, ref: 'tag' }],
        comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }]
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
